import Zoom from 'react-medium-image-zoom'
const MobileView = ({setInfoState}) => {
    return(
    <div className="h-75 w-100 mx-3 d-block d-md-none overflow-auto" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}}>
        {/**Back button */}
        <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-warning mt-2 me-2" onClick={() => setInfoState(false)}>Go Back</button>
        </div>

        <div className="h-75 w-100 d-flex align-items-center justify-content-evenly my-3">
            <div className="carousel slide h-100 w-75" data-bs-ride='false' id="imgSlide1">
                <div className="carousel-inner h-100">
                    {/**Card 1*/}
                    <div className="carousel-item active h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step1.png" alt="step1" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 1</h5>
                                <p className="card-text">Go to any song/video on YouTube and click the share icon.</p>

                            </div>
                        </div>
                    </div>
                    {/**Card 2 */}
                    <div className="carousel-item  h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step2.png" alt="step2" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 2</h5>
                                <p className="card-text">Click the "Copy" button next to the URL of the song/video.</p>
                            </div>
                        </div>
                    </div>
                    {/**Card 3 */}
                    <div className="carousel-item  h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step3.png" alt="step3" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 3</h5>
                                <p className="card-text">Right click on the input and select "Paste" or press the "Control/Ctrl" and "V" keys ("Command/Cmd" and "V" for mac users) at the same time to paste the copied URL.</p>
                            </div>
                        </div>
                    </div>
                    {/**Card 4 */}
                    <div className="carousel-item  h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step4.png" alt="step4" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 4</h5>
                                <p className="card-text">Once the URL is pasted, click the blue download button to begin the download.</p>
                            </div>
                        </div>
                    </div>
                    {/**Card 5 */}
                    <div className="carousel-item  h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step5.png" alt="step5" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 5</h5>
                                <p className="card-text">The download process should take about a minute to finish, please do not refresh the page or leave this window while a song/video is downloading.</p>
                            </div>
                        </div>
                    </div>
                    {/**Card 6 */}
                    <div className="carousel-item  h-100">
                        <div className="card h-100 text-bg-dark">
                            <Zoom>
                                <img src="/Step6.png" alt="step6" className='card-img-top' />
                            </Zoom>
                            <div className="card-body">
                                <h5 className="card-title text-center">Step 6</h5>
                                <p className="card-text">If the download finished succesfully, a pop up window will appear allowing you to name the MP3 file and choose where to store it.</p>
                            </div>
                        </div>
                    </div>

                    <button type="button" className="carousel-control-prev h-50" data-bs-target='#imgSlide1' data-bs-slide='prev'>
                        <span className="carousel-control-prev-icon" />
                    </button>
                    <button type="button" className="carousel-control-next h-50" data-bs-target='#imgSlide1' data-bs-slide='next'>
                        <span className="carousel-control-next-icon" />
                    </button>
                </div>
            </div>
        </div>

        {/**Text */}
        <div className="d-flex w-100 justify-content-center mt-3 px-1">
            <h3 className="text-white w-100 text-center">*Please note that there are certain songs that will not work, if you experience any bugs or problems please let me know at <a href="https://www.instagram.com/el_arr0gante/" target='_blank' rel='noopener noreferrer'>@el_arr0gante</a> on Instagram</h3>
        </div>

    </div>)
}
export default MobileView;