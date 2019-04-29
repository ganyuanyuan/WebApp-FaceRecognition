import React from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Logo  from './components/Logo/Logo.js';
import Rank  from './components/Rank/Rank.js';
import Signin  from './components/Signin/Signin.js';
import Register  from './components/Register/Register.js';
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm.js';
import './App.css';

const app = new Clarifai.App({
 apiKey: '2b0c05cacb82438f8a6668a7456f49d8'
});

const particlesOptions ={
  particles: {
    number:{
      value: 90,
      density:{
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box:{},
      route:'signin',
      isSignedIn : false,
    }
  }
  caluculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol : clarifaiFace.left_col *width,
      topRow : clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col*width),
      bottomRow: height-(clarifaiFace.bottom_row*height),
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box:box});
  }

  onButtonSubmit = (event)=>{
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.caluculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }

  onRouteChange = (route) =>{
    if (route==='home'){
      this.setState({isSignedIn:true})
    } else{
      this.setState({isSignedIn:false})
    }
    this.setState({route: route});
  }


  render(){
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        { this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm
                onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
            </div>
          : (
              this.state.route === 'signin'
              ?  <Signin onRouteChange={this.onRouteChange}/>
              :  <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
