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
  const selectedOptions = Form.useWatch('productOptions', form);

  return (
    <Form.Item name="productOptions">
      <div>
        { selectedOptions != null && selectedOptions.map((item) => {
          return <SelectedOption selectedOption={item} form={form} />;
        }) }
      </div>
    </Form.Item>
  );
}
