import React, {useEffect, useState} from 'react';
import {FieldAppSDK} from '@contentful/app-sdk';
import {useSDK} from '@contentful/react-apps-toolkit';
import {Flex, TextInput, Select} from "@contentful/f36-components";

const CONVERSION_RATE = 2.20462;
const convertKgToLbs = (kg: number): number => kg * CONVERSION_RATE
const convertLbsToKg = (lbs: number): number => lbs / CONVERSION_RATE


const Field = () => {
    const sdk = useSDK<FieldAppSDK>();
    sdk.window.startAutoResizer();

    const {justifyContent, inputWidth} = sdk.parameters.installation;
    const ROUND_TO = sdk.parameters.instance.roundTo || 2;

    const [value, setValue] = useState<number>(() => {
        let initialValue = sdk.entry.fields['weight'].getValue();
        return initialValue ? Number(initialValue.toFixed(ROUND_TO)) : 0;
    });
    const [isKg, setIsKg] = useState<string>(
        sdk.entry.fields['isKg'].getValue().toString());

    useEffect(() => {
        const detachUnitChangeHandler = sdk.entry.fields['isKg'].onValueChanged((newUnit) => {
            let newValue = (newUnit == true) ? convertKgToLbs(value) : convertLbsToKg(value);
            newValue = Number(newValue.toFixed(ROUND_TO));
            sdk.entry.fields['weight'].setValue(newValue);
            setValue(newValue);
            setIsKg(newUnit);
        });
        return () => {
            detachUnitChangeHandler();
        }
    }, []);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val: number = Number(e.target.value);
        val = Number(val.toFixed(ROUND_TO));
        setValue(val);
        sdk.entry.fields['weight'].setValue(val);
    }
    return (
        <Flex justifyContent={justifyContent}>
            <TextInput
                type="number"
                value={String(value)}
                onChange={handleNumberChange}
                style={{width: inputWidth}}
                isRequired
            />
            <Select
                name="unitSelect"
                value={isKg}
                onChange={e => sdk.entry.fields['isKg'].setValue(e.target.value === 'true')}
            >
                <Select.Option value='true'>Kg</Select.Option>
                <Select.Option value='false'>Lbs</Select.Option>
            </Select>
        </Flex>
    );
};

export default Field;
