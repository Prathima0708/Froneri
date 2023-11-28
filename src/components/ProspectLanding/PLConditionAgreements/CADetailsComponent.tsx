import View from 'src/components/View';
import React from 'react';
import InputText from 'src/components/InputText';

interface CADetailsComponentProps {
  conditionAggrementInputData: any;
  handleInputChange: any;
}

const CADetailsComponent = (props: CADetailsComponentProps) => {
  const { conditionAggrementInputData, handleInputChange } = props;

  const createdBy = conditionAggrementInputData?.createdBy
    ? conditionAggrementInputData?.createdBy.trim()
    : '--';
  const creationDatetime = conditionAggrementInputData?.creationDatetime
    ? conditionAggrementInputData?.creationDatetime.trim()
    : '--';
  const conditionsSignedDatetime =
    conditionAggrementInputData?.conditionsSignedDatetime
      ? conditionAggrementInputData?.conditionsSignedDatetime.trim()
      : '--';
  const status = conditionAggrementInputData?.status
    ? conditionAggrementInputData?.status.trim()
    : '--';
  const updatedBy = conditionAggrementInputData?.updatedBy
    ? conditionAggrementInputData?.updatedBy.trim()
    : '--';
  const updateDatetime = conditionAggrementInputData?.updateDatetime
    ? conditionAggrementInputData?.updateDatetime.trim()
    : '--';

  const handleCreatedBy = handleInputChange('createdBy');
  const handleUpdatedBy = handleInputChange('updatedBy');

  return (
    <View>
      <View row marginT-v5>
        <View flex marginR-v2>
          <InputText
            title="Agreement Number"
            isEditable={false}
            value={conditionAggrementInputData.conditionAgreementNumber}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Type"
            isEditable={false}
            value={conditionAggrementInputData.description}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Created By"
            isEditable={false}
            value={createdBy}
            onChangeText={handleCreatedBy}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Created Date"
            isEditable={false}
            value={creationDatetime}
          />
        </View>
      </View>
      <View row marginT-v5>
        <View flex marginR-v2>
          <InputText
            title="Signed Date"
            isEditable={false}
            value={conditionsSignedDatetime}
          />
        </View>
        <View flex marginR-v2>
          <InputText title="Status" isEditable={false} value={status} />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Updated By"
            isEditable={false}
            value={updatedBy}
            onChangeText={handleUpdatedBy}
          />
        </View>
        <View flex marginR-v2>
          <InputText
            title="Updated Date"
            isEditable={false}
            value={updateDatetime}
          />
        </View>
      </View>
    </View>
  );
};

export default CADetailsComponent;
