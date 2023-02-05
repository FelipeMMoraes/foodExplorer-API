const AppError = require("../utils/AppError")


const statusValidation = (request, _response, next) => {
  const props = ['Aguardando', 'Preparando', 'Entregue']
  if(!props.includes(request.body.status)){
    throw new AppError("Não é possivel atualizar o pedido, verifique as informações")
  }
  return next();
}

module.exports = statusValidation