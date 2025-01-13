import { createFeatureSelector, createSelector } from "@ngrx/store";

import { item } from "./inventory.model";

const getProductState=createFeatureSelector<item>('product')

export const getProductList=createSelector(getProductState,(state)=>{
    return state.list;
})

export const selectItem=createSelector(getProductState,(state)=>{
    return state.list;
})



