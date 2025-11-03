const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'pizza-builder',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addNewToppingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewTopping', inputVars);
}
addNewToppingRef.operationName = 'AddNewTopping';
exports.addNewToppingRef = addNewToppingRef;

exports.addNewTopping = function addNewTopping(dcOrVars, vars) {
  return executeMutation(addNewToppingRef(dcOrVars, vars));
};

const listPizzasForPizzeriaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPizzasForPizzeria', inputVars);
}
listPizzasForPizzeriaRef.operationName = 'ListPizzasForPizzeria';
exports.listPizzasForPizzeriaRef = listPizzasForPizzeriaRef;

exports.listPizzasForPizzeria = function listPizzasForPizzeria(dcOrVars, vars) {
  return executeQuery(listPizzasForPizzeriaRef(dcOrVars, vars));
};

const createNewOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewOrder', inputVars);
}
createNewOrderRef.operationName = 'CreateNewOrder';
exports.createNewOrderRef = createNewOrderRef;

exports.createNewOrder = function createNewOrder(dcOrVars, vars) {
  return executeMutation(createNewOrderRef(dcOrVars, vars));
};

const getOrderDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrderDetails', inputVars);
}
getOrderDetailsRef.operationName = 'GetOrderDetails';
exports.getOrderDetailsRef = getOrderDetailsRef;

exports.getOrderDetails = function getOrderDetails(dcOrVars, vars) {
  return executeQuery(getOrderDetailsRef(dcOrVars, vars));
};
