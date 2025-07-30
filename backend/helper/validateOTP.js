

const validateOTP = async(time) =>{
    const currTime = new Date().getTime();

    const timeDiff = (currTime-time)/1000;

    const minutes = timeDiff/60;

    return minutes <= 60;
}

module.exports = {validateOTP}