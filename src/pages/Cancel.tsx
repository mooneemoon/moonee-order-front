import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CancelOrderForm } from '../types/form';
import { useMutation } from 'react-query';
import { cancelOrder } from '../api/order';
import { PostCancelOrderParam } from '../types/api';

export function Cancel(): React.ReactElement {
  const { orderId, orderProductOptionId } = useParams<{
    orderId: string, orderProductOptionId?: string,
  }>() as { orderId: string, orderProductOptionId?: string };
  const [form] = Form.useForm<CancelOrderForm>();
  const navigate = useNavigate();

  const { mutate } = useMutation(
    cancelOrder,
    {
      onSuccess: (data) => {
        navigate(`../${orderId}/detail`);
      },
      onError: ({ response }) => {
        const error = response.data.error;
        alert(error.data);
        navigate(`../${orderId}/detail`);
      },
    }
  );

  const submit = (formData: CancelOrderForm): void => {
    const param: PostCancelOrderParam = {
      orderId: formData.orderId,
      orderProductOptionId: formData.orderProductOptionId,
      reason: formData.reason,
    };
    mutate(param);
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={submit}
        validateMessages={{
          /* eslint-disable no-template-curly-in-string */
          required: '필수 입력값입니다',
        }}
      >
        <Form.Item name="orderId" label="주문번호" initialValue={orderId}>{ orderId }</Form.Item>
        { orderProductOptionId && <Form.Item name="orderProductOptionId" label="주문 상품 번호" initialValue={orderProductOptionId}>{ orderProductOptionId }</Form.Item> }
        <Form.Item name="reason" label="취소 사유" rules={[{ required: true }]}>
          <TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">취소</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
