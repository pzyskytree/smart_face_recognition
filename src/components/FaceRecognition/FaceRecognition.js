import React from "react";
import Box from "./Box"
import "./FaceRecognition.css"

const FaceRecognition = ({imageUrl, boxes}) =>{
    return (
        <div className="center ma">
            <div className="absolute mt2">
                <img id='inputImage' src={imageUrl} alt="" width="500px" height="auto"/>
                <Box boxes={boxes}/>
            </div>
        </div>
    )
}

export default FaceRecognition;