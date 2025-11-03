import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'pizza-builder',
  location: 'us-east4'
};

export const addNewToppingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewTopping', inputVars);
}
addNewToppingRef.operationName = 'AddNewTopping';

export function addNewTopping(dcOrVars, vars) {
  return executeMutation(addNewToppingRef(dcOrVars, vars));
}

export const listPizzasForPizzeriaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPizzasForPizzeria', inputVars);
}
listPizzasForPizzeriaRef.operationName = 'ListPizzasForPizzeria';

export function listPizzasForPizzeria(dcOrVars, vars) {
  return executeQuery(listPizzasForPizzeriaRef(dcOrVars, vars));
}

export const createNewOrderRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNewOrder', inputVars);
}
createNewOrderRef.operationName = 'CreateNewOrder';

export function createNewOrder(dcOrVars, vars) {
  return executeMutation(createNewOrderRef(dcOrVars, vars));
}

export const getOrderDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetOrderDetails', inputVars);
}
getOrderDetailsRef.operationName = 'GetOrderDetails';

export function getOrderDetails(dcOrVars, vars) {
  return executeQuery(getOrderDetailsRef(dcOrVars, vars));
}

