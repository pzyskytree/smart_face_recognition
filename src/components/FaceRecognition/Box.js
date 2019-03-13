import React from "react";

const Box = ({boxes}) => {
    return (
        <div>
            {
                boxes.map((box, i) =>
                    (<div className="bounding-box"
                          key = {i}
                          style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
                    </div>))
            }
        </div>
    );
}


export default Box;