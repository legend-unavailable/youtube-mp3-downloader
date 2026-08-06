import { useState } from 'react'
import axios from 'axios'
import Zoom from 'react-medium-image-zoom'
import MobileView from './MobileView';


function App() {
  const [url, setUrl] = useState('');
  const [btnState, setBtnState] = useState(false);
  const [downloadState, setDownloadState] = useState(0);
  const [infoState, setInfoState] = useState(false);
  const [inputErr, setInputErr] = useState(false);

  const handleChange = (e) => {
    setUrl(e.target.value);
  }

  const urlValidator = () => {
    try {
      let cleanURL = url.trim();
      if (!cleanURL.startsWith('http://') && !cleanURL.startsWith('https://')) {cleanURL = 'https://' + cleanURL;}
      const parsed = new URL(cleanURL);

      const hostname = parsed.hostname.replace('www.', '').replace('m.', '');
      if (hostname === 'youtube.com') {
        if (parsed.pathname === '/watch') {
          const videoID = parsed.searchParams.get('v');
          return videoID !== null && videoID.length === 11;
        }

        if (parsed.pathname.startsWith('/embed/') ||
            parsed.pathname.startsWith('/v/') || 
            parsed.pathname.startsWith('/shorts/')) {
              const pathSegmets = parsed.pathname.split('/');
              const videoID = pathSegmets[2];
              return videoID !== null && videoID.length === 11;          
        }
        return false;
      }

      if (hostname === 'youtu.be') {
        const shortID = parsed.pathname.substring(1);
        return shortID.length === 11;
      }

      return false;
    } catch (error) {
      return false;
    }
    //const regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})(?:\S+)?$/;;
    //return regExp.test(url.trim());
  }

  //disable download btn while vid is transcoding/downloading
  const downloadSong = async(e) => {
    e.preventDefault();
    setInputErr(false);
    if (!urlValidator()) {
      setInputErr(true);
      return;
    }
    setBtnState(true);
    try {
      const res = await window.electronAPI.downloadMP3(url);
      /*const res = await axios.post('/api', {
        params: {url}},
        {
          responseType: 'blob',
          transformResponse: [(data) => data]
        }
      );

      

      const blob = new Blob([res.data], {type: 'audio/mp3'});
      const  downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'audio.mp3');
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      console.log(res);*/
      console.log(res);
      
      if (!res.success) {
        console.log('error');
        setDownloadState(2);
        
      }
      else {setDownloadState(1);}
    } catch (error) {
      console.log('failed', error);
      setDownloadState(2);
    }
    setBtnState(false);
  }

  const renderDownloadState = () => {
    if (btnState) return;
    switch (downloadState) {
      case 0:
        return <h1>Running</h1> ;           
      case 1:
        return <h1 style={{color: 'rgba(0, 255, 0)'}}>Success</h1>;
      case 2:
        return <h1 className="text-danger">Failure</h1>;
    }
  }

  return (
    <div className='position-relative vh-100 vw-100'>
    <form className='d-flex flex-column align-items-center justify-content-center h-100 w-100 bg-dark z-1 position-absolute' onSubmit={downloadSong}
    style={{backgroundImage: "url('./background.jpeg')"}}>
      
      <div style={{backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)'}} className='rounded-3'>
        <div className="card text-white" style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}>
          <div className="card-body d-flex flex-column align-items-center">
            <h1 className="fw-bold mb-4 text-center">YouTube to MP3 Downloader</h1>
            <h3 className="card-subtitle mb-3 text-center">Paste a YouTube link of any song you wish to download</h3>
            <h5 className='text-center'>For a full breakdown of how it works <a href='#' onClick={() => setInfoState(true)}>click here!</a></h5>
            <div className="input-group w-75">
              <input 
              type="text" 
              placeholder='www.youtube.com'
              value={url}
              onChange={handleChange}
              onPaste={handleChange}
              className='w-50 form-control d-block d-md-none' />
              <input 
              type="text" 
              placeholder='www.youtube.com'
              value={url}
              onChange={handleChange}
              onPaste={handleChange}
              className='w-50 form-control d-none d-md-block' />
              <button type="submit" className='btn btn-primary' disabled={btnState}>Download</button>
            </div>
            {inputErr && <h3 className="text-danger">No valid Youtube URL found.</h3> }
          </div>
        </div>
        <div className='w-100 d-flex flex-column align-items-center'>
          <div className="d-flex text-white justify-content-evenly w-100">
            <h1>Status: </h1>
            {btnState && <h1>Downloading</h1>}
            {renderDownloadState()}
          </div>
          <div className="d-flex justify-content-center">
            {btnState && <img src='./musicDisk.gif' alt='loading' className='h-50 w-50'/>}
          </div>
        </div>
      </div>
    </form>
    {infoState && 
    <div className="w-100 h-100 z-2 position-absolute d-flex align-items-center">
      <div className="h-75 w-100 mx-3 d-none d-md-block overflow-auto" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>
        <div className="d-flex justify-content-end">
          <button type="button" className='btn btn-warning my-2 me-2' onClick={() => setInfoState(false)}>Go Back</button>
        </div>

        <div className="h-75 w-100 d-flex align-items-center justify-content-evenly mb-3">
          <div className="carousel slide h-100 w-25" data-bs-ride='false' id='imgSlide'>
            <div className="carousel-inner h-100">

              <div className="carousel-item active h-100">
                <div className="card h-100 text-bg-dark">
                  <Zoom>
                    <img src="./Step1.png" alt="step1" className='card-img-top'/>
                  </Zoom>
                  <div className="card-body">
                    <h5 className="card-title text-center">Step 1</h5>
                    <p className="card-text text-center">Go to any song/video on YouTube and click the share icon.</p>
                  </div>
                </div>
              </div>

              <div className="carousel-item h-100">
                <div className="card h-100 text-bg-dark">
                  <Zoom>
                    <img src="./Step2.png" alt="step2" className='card-img-top' />
                  </Zoom>
                  <div className="card-body">
                    <h5 className="card-title text-center">Step 2</h5>
                    <p className="card-text text-center">Click the "Copy" button next to the URL of the song/video</p>
                  </div>
                </div>
              </div>

              <button type="button" className='carousel-control-prev' data-bs-target='#imgSlide' data-bs-slide='prev'>
                <span className="carousel-control-prev-icon" />
              </button>
              <button type="button" className='carousel-control-next' data-bs-target='#imgSlide' data-bs-slide='next'>
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>

          <div className="h-100 w-25">
            <div className="card h-100 text-bg-dark">
              <Zoom>
                <img src="./Step3.png" alt="step3" className='card-img-top'/>
              </Zoom>
              <div className="card-body">
                <h5 className="card-title text-center">Step 3</h5>
                <p className="-card-text text-center">Right click on the input and select "Paste" or press the "Control/Ctrl" and "V" keys ("Command/Cmd" and "V" for mac users) at the same time to paste the copied URL.</p>
              </div>
            </div>
          </div>

          <div className="carousel slide h-100 w-25" data-bs-ride='false' id='downloader'>
            <div className="carousel-inner h-100">
              {/*Card 4*/}
              <div className="carousel-item active h-100">
                <div className="card h-100 text-bg-dark">
                  <Zoom>
                    <img src="./Step4.png" alt="step4" className='card-img-top'/>
                  </Zoom>
                  <div className="card-body">
                    <h5 className="card-title text-center">Step 4</h5>
                    <p className="card-text text-center">Once the URL is pasted, click the blue download button  or hit the enter key to begin the download.</p>
                  </div>
                </div>
              </div>
              {/**Card 5 */}
              <div className="carousel-item h-100">
                <div className="card h-100 text-bg-dark">
                  <Zoom>
                    <img src="./Step5.png" alt="step5" className='card-img-top'/>
                  </Zoom>
                  <div className="card-body">
                    <h5 className="card-title text-center">Step 5</h5>
                    <p className="card-text text-center">Once clicked, a pop up window will appear allowing you to name the MP3 file and choose where to store it.</p>
                  </div>
                </div>
              </div>
              {/**Card 6 */}
              <div className="carousel-item h-100">
                <div className="card h-100 text-bg-dark">
                  <Zoom>
                    <img src="./Step6.png" alt="step6" className='card-img-top'/>
                  </Zoom>
                  <div className="card-body">
                    <h5 className="card-title text-center">Step 6</h5>
                    <p className="card-text text-center">Once chosen, the song will be transcoded and downloaded to the location you decided. A loading icon will appear and will take about a minute to finish. PLEASE DO NOT EXIT THE WINDOW WHILE LOADING. If the download finished succesfully, the status will show 'Success'.</p>
                  </div>
                </div>
              </div>
              {/*Buttons*/}
              <button type="button" className="carousel-control-prev h-50" data-bs-target='#downloader' data-bs-slide='prev'>
                <span className="carousel-control-prev-icon" />
              </button>
              <button type="button" className="carousel-control-next h-50" data-bs-target='#downloader' data-bs-slide='next'>
                <span className="carousel-control-next-icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex w-100 justify-content-center mt-3">
          <h3 className='text-white w-50 text-center'>*Please note that certain age restricted songs will not work, if you experience any bugs or problems please let me know at <a href="https://www.instagram.com/el_arr0gante/" target='_blank' rel='noopener noreferrer'>@el_arr0gante</a> on Instagram</h3>
        </div>

      </div>

      <MobileView setInfoState={setInfoState} />



      
      
      
    </div> 
    }
    </div>
  )
}

export default App
