import React,{Component} from 'react';
import Particles from 'react-tsparticles';
import Clarifai  from 'clarifai';
import './App.css';
import Signin from './components/Signin/Signin';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank';


const app = new Clarifai.App({
  apiKey: '4f6f1b662cc0456dbce8d6787c0d6e95'
 });

class App extends Component{
  constructor(){
    super();
    this.state ={
      input: '',
      imageUrl: '',
      box: {} ,
      route: 'signin',
    }
  }

  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row *height,
      rightCol : width -(clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
     
  }

  onRouteChange = (route) =>{
    this.setState({route: route});
  }

  render(){
    const particlesInit = (main) => {
      //console.log(main);
  
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
    };
    const particlesLoaded = (container) => {
      //console.log(container);
    };
    return (
      <div className="App">
      <Particles className='particles'
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "red",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0.8,
              size: 40,
            },
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.4,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.1,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }}
    />
        <Navigation onRouteChange={this.onRouteChange} />
        { this.state.route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange} />
            : <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} /> 
            </div>
            }
      </div>
    );
  }
}

export default App;