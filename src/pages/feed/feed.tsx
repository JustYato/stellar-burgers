import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { RequestStatus } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  getFeed,
  getStatusRequest
} from '../../slices/feedSlice';

export const Feed: FC = () => {
  const orders = useSelector(selectOrders);

  const statusRequest = useSelector(getStatusRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(getFeed());
  };

  if (!orders.length || statusRequest === RequestStatus.Loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
