import { Button, Form, FormInstance, Select } from 'antd';
import { ProductForm } from '../types/form';
import React from 'react';
import { PostCreatedOrderSheetSelectedOptionParam } from '../types/api';

interface SelectedOptionProps {
  selectedOption: PostCreatedOrderSheetSelectedOptionParam;
  form: FormInstance<ProductForm>;
}
export function SelectedOption({
  selectedOption,
  form,
}: SelectedOptionProps): React.ReactElement {
  const selectedOptions = Form.useWatch('productOptionList', form);
  const handleSelectedOptionCount = (optionCount: number) :void => {
    selectedOptions.forEach((option : PostCreatedOrderSheetSelectedOptionParam) => {
      if (selectedOption.optionId === option.optionId) {
        option.count = optionCount;
        return;
      }
    });
    form.setFieldsValue({
      productOptionList: selectedOptions,
    });
    selectedOption.count = optionCount;
  };

  const removeSelectedOption = ():void => {
    const index = selectedOptions.indexOf(selectedOption);
    selectedOptions.splice(index, 1);
    form.setFieldsValue({
      productOptionList: selectedOptions,
    });
  };

  return (
    <div>
      <div>
        { `optionId : ${selectedOption.optionId}, count : ${selectedOption.count}` }
        <Button onClick={removeSelectedOption}>X</Button>
      </div>
      <div>
        <Select onChange={handleSelectedOptionCount}>
          { Array.from({ length: 10 }).map((_, index) => {
            return (
            // eslint-disable-next-line react/no-array-index-key
              <Select.Option key={index + 1}>{ index + 1 }</Select.Option>
            );
          }) }
        </Select>
      </div>
    </div>
  );
}
