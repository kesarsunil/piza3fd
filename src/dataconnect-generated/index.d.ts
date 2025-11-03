import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddNewToppingData {
  topping_insert: Topping_Key;
}

export interface AddNewToppingVariables {
  name: string;
  price: number;
}

export interface CreateNewOrderData {
  order_insert: Order_Key;
}

export interface CreateNewOrderVariables {
  customerId: UUIDString;
  pizzeriaId: UUIDString;
  deliveryAddress?: string | null;
  notes?: string | null;
  orderDate: TimestampString;
  status: string;
  totalAmount: number;
}

export interface GetOrderDetailsData {
  order?: {
    id: UUIDString;
    customerId: UUIDString;
    pizzeriaId: UUIDString;
    createdAt: TimestampString;
    deliveryAddress?: string | null;
    notes?: string | null;
    orderDate: TimestampString;
    status: string;
    totalAmount: number;
    customer: {
      id: UUIDString;
      displayName: string;
      email: string;
      phoneNumber?: string | null;
      address?: string | null;
    } & User_Key;
      pizzeria: {
        id: UUIDString;
        name: string;
        address: string;
        phoneNumber: string;
      } & Pizzeria_Key;
        orderItems_on_order: ({
          id: UUIDString;
          pizzaId?: UUIDString | null;
          customizationDetails?: string | null;
          price: number;
          quantity: number;
          pizza?: {
            id: UUIDString;
            name: string;
            description?: string | null;
            basePrice: number;
          } & Pizza_Key;
            toppings_via_OrderItemTopping: ({
              id: UUIDString;
              name: string;
              price: number;
            } & Topping_Key)[];
        } & OrderItem_Key)[];
  } & Order_Key;
}

export interface GetOrderDetailsVariables {
  orderId: UUIDString;
}

export interface ListPizzasForPizzeriaData {
  pizzas: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    basePrice: number;
    imageUrl?: string | null;
  } & Pizza_Key)[];
}

export interface ListPizzasForPizzeriaVariables {
  pizzeriaId: UUIDString;
}

export interface OrderItemTopping_Key {
  orderItemId: UUIDString;
  toppingId: UUIDString;
  __typename?: 'OrderItemTopping_Key';
}

export interface OrderItem_Key {
  id: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Pizza_Key {
  id: UUIDString;
  __typename?: 'Pizza_Key';
}

export interface Pizzeria_Key {
  id: UUIDString;
  __typename?: 'Pizzeria_Key';
}

export interface Topping_Key {
  id: UUIDString;
  __typename?: 'Topping_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface AddNewToppingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewToppingVariables): MutationRef<AddNewToppingData, AddNewToppingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewToppingVariables): MutationRef<AddNewToppingData, AddNewToppingVariables>;
  operationName: string;
}
export const addNewToppingRef: AddNewToppingRef;

export function addNewTopping(vars: AddNewToppingVariables): MutationPromise<AddNewToppingData, AddNewToppingVariables>;
export function addNewTopping(dc: DataConnect, vars: AddNewToppingVariables): MutationPromise<AddNewToppingData, AddNewToppingVariables>;

interface ListPizzasForPizzeriaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListPizzasForPizzeriaVariables): QueryRef<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListPizzasForPizzeriaVariables): QueryRef<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;
  operationName: string;
}
export const listPizzasForPizzeriaRef: ListPizzasForPizzeriaRef;

export function listPizzasForPizzeria(vars: ListPizzasForPizzeriaVariables): QueryPromise<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;
export function listPizzasForPizzeria(dc: DataConnect, vars: ListPizzasForPizzeriaVariables): QueryPromise<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;

interface CreateNewOrderRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewOrderVariables): MutationRef<CreateNewOrderData, CreateNewOrderVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewOrderVariables): MutationRef<CreateNewOrderData, CreateNewOrderVariables>;
  operationName: string;
}
export const createNewOrderRef: CreateNewOrderRef;

export function createNewOrder(vars: CreateNewOrderVariables): MutationPromise<CreateNewOrderData, CreateNewOrderVariables>;
export function createNewOrder(dc: DataConnect, vars: CreateNewOrderVariables): MutationPromise<CreateNewOrderData, CreateNewOrderVariables>;

interface GetOrderDetailsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetOrderDetailsVariables): QueryRef<GetOrderDetailsData, GetOrderDetailsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetOrderDetailsVariables): QueryRef<GetOrderDetailsData, GetOrderDetailsVariables>;
  operationName: string;
}
export const getOrderDetailsRef: GetOrderDetailsRef;

export function getOrderDetails(vars: GetOrderDetailsVariables): QueryPromise<GetOrderDetailsData, GetOrderDetailsVariables>;
export function getOrderDetails(dc: DataConnect, vars: GetOrderDetailsVariables): QueryPromise<GetOrderDetailsData, GetOrderDetailsVariables>;

