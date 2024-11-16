import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import {
  resetOrderInfo,
  getOrder,
  selectOrderInfo
} from '../../slices/orderSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { orderInfo: orderData, ingredients: ingredientsData } = useSelector(
    (state) => ({
      orderInfo: selectOrderInfo(state),
      ingredients: selectIngredients(state)
    })
  );
  const { number: orderIdString } = useParams();

  const orderId = Number(orderIdString);

  useEffect(() => {
    dispatch(getOrder(orderId));
    return () => {
      dispatch(resetOrderInfo());
    };
  }, [dispatch, orderId]);

  const ingredients = useMemo(
    () =>
      ingredientsData.filter((item) =>
        orderData?.ingredients.includes(item._id)
      ),
    [ingredientsData, orderData?.ingredients]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
