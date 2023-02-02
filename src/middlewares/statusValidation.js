const AppError = require("../utils/AppError")


const statusValidation = (request, _response, next) => {
  const props = ['pending', 'preparing', 'delivered']
  if(props.includes(request.body.statusCode)){
    throw new AppError("Informações invalidas, por favor verifique-as")
  }
  return next();
}

module.exports = statusValidation