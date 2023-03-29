import { Form, FormInstance } from 'antd';
import { ProductForm } from '../types/form';
import React from 'react';
import { SelectedOption } from './SelectedOption';

interface SelectedOptionProps {
  form: FormInstance<ProductForm>;
}
export function SelectedOptionList({
  form,
}: SelectedOptionProps): React.ReactElement {
  const productOptionList = Form.useWatch('productOptionList', form);

  return (
    <Form.Item name="productOptionList">
      <div>
        { productOptionList != null && productOptionList.map((item) => {
          return <SelectedOption key={item.optionId} selectedOption={item} form={form} />;
        }) }
      </div>
    </Form.Item>
  );
}
