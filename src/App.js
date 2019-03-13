import React, { Component } from 'react';
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import './App.css';

const particleOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable:true,
                value_area:800
            }
        }
    }
}

const initialState = {
    input: '',
    imageUrl: '',
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: ""
    }
}

class App extends Component {
    constructor(){
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
        }})
    }

    calculateFaceLocation = (data) => {
        // region_info.bounding_box
        const clarifaiFace = data.outputs[0].data.regions;
        const image = document.getElementById("inputImage");
        const width = Number(image.width);
        const height = Number(image.height);
        return clarifaiFace.map((face) =>{
            return {
                leftCol: face.region_info.bounding_box.left_col * width,
                topRow: face.region_info.bounding_box.top_row * height,
                rightCol: width - (face.region_info.bounding_box.right_col * width),
                bottomRow: height - (face.region_info.bounding_box.bottom_row * height)
            }
        })
    }

    displayFaceBox = (boxes) => {
        this.setState({boxes: boxes})
    }

    onInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    onPictureSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch("https://dry-cove-31341.herokuapp.com/imageUrl", {
            method: "post",
            headers:  {"Content-Type": "application/json"},
            body:JSON.stringify({
                input:this.state.input
            })
        }).then(response => response.json())
            .then(response => {
                if (response){
                    fetch("https://dry-cove-31341.herokuapp.com/image", {
                        method: "put",
                        headers:  {"Content-Type": "application/json"},
                        body:JSON.stringify({
                           id: this.state.user.id
                        })
                    }).then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, {entries : count}))
                        })
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === "signout"){
            this.setState(initialState);
        }else if (route === "home") {
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    render(){
        const {isSignedIn, imageUrl, boxes, route} = this.state;
        return (
            <div className="App">
                <Particles className="particles" params={particleOptions}/>
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                { route === "home" ?
                    <div>
                        <Logo/>
                        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onPictureSubmit={this.onPictureSubmit}
                        />
                        <FaceRecognition
                            imageUrl={imageUrl}
                            boxes = {boxes}
                        />
                    </div> :
                    (
                       route === "register" ?
                            <Register onRouteChange={this.onRouteChange}
                                      loadUser = {this.loadUser}/>  :
                            <Signin onRouteChange={this.onRouteChange}
                                    loadUser = {this.loadUser}/>
                    )

                }
          </div>
        );
    }
}

export default App;
