import { AddNewToppingData, AddNewToppingVariables, ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables, CreateNewOrderData, CreateNewOrderVariables, GetOrderDetailsData, GetOrderDetailsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewTopping(options?: useDataConnectMutationOptions<AddNewToppingData, FirebaseError, AddNewToppingVariables>): UseDataConnectMutationResult<AddNewToppingData, AddNewToppingVariables>;
export function useAddNewTopping(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewToppingData, FirebaseError, AddNewToppingVariables>): UseDataConnectMutationResult<AddNewToppingData, AddNewToppingVariables>;

export function useListPizzasForPizzeria(vars: ListPizzasForPizzeriaVariables, options?: useDataConnectQueryOptions<ListPizzasForPizzeriaData>): UseDataConnectQueryResult<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;
export function useListPizzasForPizzeria(dc: DataConnect, vars: ListPizzasForPizzeriaVariables, options?: useDataConnectQueryOptions<ListPizzasForPizzeriaData>): UseDataConnectQueryResult<ListPizzasForPizzeriaData, ListPizzasForPizzeriaVariables>;

export function useCreateNewOrder(options?: useDataConnectMutationOptions<CreateNewOrderData, FirebaseError, CreateNewOrderVariables>): UseDataConnectMutationResult<CreateNewOrderData, CreateNewOrderVariables>;
export function useCreateNewOrder(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNewOrderData, FirebaseError, CreateNewOrderVariables>): UseDataConnectMutationResult<CreateNewOrderData, CreateNewOrderVariables>;

export function useGetOrderDetails(vars: GetOrderDetailsVariables, options?: useDataConnectQueryOptions<GetOrderDetailsData>): UseDataConnectQueryResult<GetOrderDetailsData, GetOrderDetailsVariables>;
export function useGetOrderDetails(dc: DataConnect, vars: GetOrderDetailsVariables, options?: useDataConnectQueryOptions<GetOrderDetailsData>): UseDataConnectQueryResult<GetOrderDetailsData, GetOrderDetailsVariables>;
