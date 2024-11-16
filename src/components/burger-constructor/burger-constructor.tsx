import { FC, useMemo } from 'react';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { selectState } from '../../slices/burgerConstructorSlice';
import { selectUser } from '../../slices/userSlice';
import {
  selectOrderInfo,
  selectOrderStatus,
  createOrder,
  resetOrderInfo
} from '../../slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const status = useSelector(selectOrderStatus);
  const orderModalData = useSelector(selectOrderInfo);
  const constructorItems = useSelector(selectState);

  const closeModalOrder = () => dispatch(resetOrderInfo());

  const orderRequest = status === RequestStatus.Loading;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const ingredientsIdArr = [
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];
      dispatch(createOrder(ingredientsIdArr));
    }
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModalOrder}
    />
  );
};
