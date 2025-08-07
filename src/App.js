// importing library
import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import './App.css';
import { drawRect } from './labelmap';
import Navbar from './components/Navbar';
import Images from './components/Images';
import Sign from './assets/sign-1.jpeg';
import DevLogo from './assets/vivek.png';
import { useState } from 'react';
import Loading from './components/Loading';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoWidthRef = useRef(640); // Set an initial value here
  const videoHeightRef = useRef(480); // Set an initial value here

  // function for hand detections
  const detect = async (net) => {
    // checking if camera is accessible
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // for passing to Loading component
      setLoading(false);

      // for unmounting Loading component
      setTimeout(() => {
        setIsLoading(false);
      }, 12000);
      // fetching video properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Update the refs with the new videoWidth and videoHeight
      videoWidthRef.current = videoWidth;
      videoHeightRef.current = videoHeight;

      // configuring video dimensions
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // video canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Making Detections
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast('int32');
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);

      // console.log(await obj[2].array())

      // defining where objects are coming from
      const boxes = await obj[0].array(); // boxes
      const classes = await obj[6].array(); // classes
      const scores = await obj[4].array(); // threshold

      const ctx = canvasRef.current.getContext('2d');

      // using requestAnimationFrame method for smother drawing for detections
      requestAnimationFrame(() => {
        drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
      });
      // console.log(obj);
      // Cleaning memory
      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    // Loading model
    const runMobnet = async () => {
      // getting model link from cloud
      const net = await tf.loadGraphModel(
        'https://tfjshandsignmodel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json'
      );

      // Detecting hands
      setInterval(() => {
        detect(net); // fuction for making detections using webcam
      }, 16.7); // detections frequency
    };
    runMobnet();
  }, []);

  return (
    <>
      <div className="App">
        <Navbar />
        <div className="main-container scrolbar">
          <div className="flex flex-wrap justify-center align-center h-full">
            <div className="w-full md:w-1/2 h-full flex flex-col justify-center align-center relative md:order-last">
              <Webcam ref={webcamRef} className="web top-0 left-0" />
              {isLoading ? (
                <Loading
                  loading={loading}
                  videoHeight={videoHeightRef}
                  videoWidth={videoWidthRef}
                />
              ) : (
                <canvas ref={canvasRef} className="web absolute top-0 left-0" />
              )}

              {/* Horizontal sliding images */}
              <Images />
            </div>
            <div className="w-full md:w-1/2 h-full overflow-auto scrolbar md:order-first">
              {/* About */}
              <section
                class="text-gray-600 text-center body-font overflow-hidden"
                id="about"
              >
                <div class="container px-5 pt-5 pb-12 mx-auto">
                  <div class="flex flex-wrap">
                    <div class="p-12 flex flex-col items-center">
                      <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        ABOUT
                      </span>
                      <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                        Sign-Help 
                      </h2>
                      <p class="leading-relaxed">
                        Sign-Help is a web application that uses TensorFlow.js to detect
                        hand signs in real-time using a webcam. It is designed to assist
                        individuals with hearing/Speech impairments by providing a visual
                        representation of hand signs. The application uses a pre-trained
                        model to recognize hand signs and display the corresponding text
                        on the screen. The application is user-friendly and can be used
                        by anyone with a webcam. It is an innovative solution that aims to
                        bridge the communication gap between individuals with hearing/Speech
                        impairments and those without.
                        <br />
                      </p>
                      <p className=" text-gray-400">Works best on Desktop</p>
                      <img src={Sign} alt="HandSign" className="" />
                      <div class="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full"></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Developer */}
              <section
                class="text-gray-600 body-font overflow-hidden"
                id="developer"
              >
                <div class="container px-5 pt-5 pb-20 mx-auto">
                  <div class="flex flex-wrap">
                    <div class="p-12 flex flex-col items-center">
                      <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        Front-End Developer(Team Leader)
                      </span>
                      <img src={DevLogo} alt="HandSign" className="h-24 my-3" />
                      <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                        Vivek Verma
                      </h2>
                      <p class="leading-relaxed mb-8">
                        Dedicated to learning new things, attentive to
                        new ideas and technologies, I have been involved in
                        multiple projects and this web app is one of them. Make
                        sure to checkout my{' '}
                        <a
                          href="https://github.com/vivekisadev"
                          className="text-blue-500 transition-all duration-300 font-semibold hover:text-lg"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          GitHub
                        </a>{' '}
                        for more of my projects.
                      </p>
                      <div class="flex items-center justify-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://github.com/vivekisadev"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="github"
                            src="https://img.icons8.com/material-outlined/344/github.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @vivekisadev
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              GitHub
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://www.linkedin.com/in/vivekverma16/"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="linkedin"
                            src="https://img.icons8.com/fluency/344/linkedin-circled.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @vivekverma16
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              LinkedIn
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3"
                          href="mailto:iamvivek1602@gmail.com"
                        >
                          <img
                            alt="gmail"
                            src="https://img.icons8.com/color/344/google-plus--v1.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              iamvivek1602
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              Gmail
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div class="p-12 flex flex-col items-center">
                      <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        UI/UX Developer
                      </span>
                      <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                        Avnish Soni
                      </h2>
                      <p class="leading-relaxed mb-8">
                      Contributed to the visual direction of the project by designing presentation materials and aligning the overall look and feel through engaging PDFs and slides. While hands-on design implementation is a work in progress, his creative input and design mindset helped shape the team's understanding of user experience and communication.
                      </p>
                      <div class="flex items-center justify-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://github.com/avnish-1298"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="github"
                            src="https://img.icons8.com/material-outlined/344/github.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @avnish-1298
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              GitHub
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://www.linkedin.com/in/avnishsoni98/"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="linkedin"
                            src="https://img.icons8.com/fluency/344/linkedin-circled.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @avnishsoni98
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              LinkedIn
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3"
                          href="mailto:avnishsoni1298@gmail.com"
                        >
                          <img
                            alt="gmail"
                            src="https://img.icons8.com/color/344/google-plus--v1.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              avnishsoni1298
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              Gmail
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div class="p-12 flex flex-col items-center">
                      <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        Front-end Developer
                      </span>
                      
                      <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                        Ayushi Singh
                      </h2>
                      <p class="leading-relaxed mb-8">
                      Frontend Developer with a passion for crafting clean, responsive, and user-friendly web interfaces. Skilled in HTML, CSS, JavaScript, and modern frameworks like React and Vue. I focus on creating seamless user experiences, optimizing performance, and bringing design ideas to life with pixel-perfect precision. Always learning, always building.
                      </p>
                      <div class="flex items-center justify-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://github.com/singhayushi28"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="github"
                            src="https://img.icons8.com/material-outlined/344/github.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @singhayushi28
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              GitHub
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://www.linkedin.com/in/ayushi-singh-78711032b/"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="linkedin"
                            src="https://img.icons8.com/fluency/344/linkedin-circled.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @ayushi-singh-78711032b
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              LinkedIn
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3"
                          href="mailto:ayushisingh472006@gmail.com"
                        >
                          <img
                            alt="gmail"
                            src="https://img.icons8.com/color/344/google-plus--v1.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              ayushisingh472006
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              Gmail
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    <div class="p-12 flex flex-col items-center">
                      <span class="inline-block py-1 px-2 rounded bg-indigo-50 text-indigo-500 text-xs font-medium tracking-widest">
                        Back-end Developer
                      </span>
                      <h2 class="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4">
                        Gautum Saini
                      </h2>
                      <p class="leading-relaxed mb-8">
                      I am a backend developer with a strong foundation in AI, data science, and scalable system design. My work reflects a deep understanding of server-side technologies, data processing, API development, and intelligent automation. I bring a unique mix of practical engineering skills and innovation, having built systems ranging from real-time home automation with embedded AI to intelligent dashboards and simulations powered by machine learning.
                      </p>
                      <div class="flex items-center justify-center flex-wrap pb-4 mb-4 border-b-2 border-gray-100 mt-auto w-full">
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://github.com/Gautam-Saini"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="github"
                            src="https://img.icons8.com/material-outlined/344/github.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @gautam-saini
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              GitHub
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3 mb-2"
                          href="https://www.linkedin.com/in/gautam-saini-001421357"
                          target={'_blank'}
                          rel="noreferrer"
                        >
                          <img
                            alt="linkedin"
                            src="https://img.icons8.com/fluency/344/linkedin-circled.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              @gautam-saini-001421357
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              LinkedIn
                            </span>
                          </span>
                        </a>
                        <a
                          class="inline-flex items-center md:w-1/3"
                          href="mailto:gautam.saini.1969@gmail.com"
                        >
                          <img
                            alt="gmail"
                            src="https://img.icons8.com/color/344/google-plus--v1.png"
                            class="h-12 rounded-full flex-shrink-0 object-cover object-center"
                          />
                          <span class="flex-grow flex flex-col">
                            <span class="title-font font-medium text-gray-900 text-sm">
                              gautam.saini.1969
                            </span>
                            <span class="text-gray-400 text-xs tracking-widest mt-0.5">
                              Gmail
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
