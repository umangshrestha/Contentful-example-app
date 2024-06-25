import React, {useCallback, useEffect, useState} from 'react';
import {ConfigAppSDK} from '@contentful/app-sdk';
import {Flex, Form, Heading, Paragraph, TextInput, Select} from '@contentful/f36-components';
import {useSDK} from '@contentful/react-apps-toolkit';
import {css} from 'emotion';

export interface AppInstallationParameters {
    inputWidth: number;
    justifyContent: string;
}

const ConfigScreen = () => {
    const sdk = useSDK<ConfigAppSDK>();
    const [parameters, setParameters] = useState<AppInstallationParameters>({
        inputWidth: 100,
        justifyContent: 'space-between',
    });

    const onConfigure = useCallback(async () => {
        const currentState = await sdk.app.getCurrentState();
        return {
            parameters,
            targetState: currentState,
        };
    }, [parameters, sdk]);

    useEffect(() => {
        sdk.app.onConfigure(() => onConfigure());
    }, [sdk, onConfigure]);

    useEffect(() => {
        const fetchParameters = async () => {
            const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();
            if (currentParameters) {
                setParameters(currentParameters);
            }
            sdk.app.setReady();
        };

        fetchParameters();
    }, [sdk]);


    return (
        <Flex flexDirection="column" className={css({margin: '80px', maxWidth: '800px'})}>
            <Form>
                <Heading>App Config</Heading>
                <Paragraph>Set the width of the input field:</Paragraph>
                <TextInput
                    id="inputWidth"
                    type="number"
                    value={parameters.inputWidth}
                    onChange={e => setParameters({...parameters, inputWidth: Number(e.target.value)})}
                    label="Input Width"
                    description="Set the width of the input field"
                    isRequired
                />
                <br/>
                <br/>
                <Paragraph>Set the alignment of the input field:</Paragraph>
                <Select
                    id="justifyContent"
                    value={parameters.justifyContent}
                    onChange={(e) => setParameters({
                        ...parameters,
                        justifyContent: e.target.value,
                    })}
                    isRequired
                >
                    <Select.Option value="center">Center</Select.Option>
                    <Select.Option value="flex-start">Flex Start</Select.Option>
                    <Select.Option value="flex-end">Flex End</Select.Option>
                    <Select.Option value="space-between">Space Between</Select.Option>
                    <Select.Option value="space-around">Space Around</Select.Option>
                    <Select.Option value="space-evenly">Space Evenly</Select.Option>
                </Select>
            </Form>
        </Flex>
    );
};

export default ConfigScreen;
