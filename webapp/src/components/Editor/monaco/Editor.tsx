import React, {useRef} from 'react';

import MonacoEditor, {useMonaco, OnMount} from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';

export type ValueGetter = {
    getValue(): string | undefined
}

type EditorProps = {
    value?: string,
    language?: string,
    setValueGetter?(_: ValueGetter): void,
    options: any,
    onChange?(value: string | undefined): void,
}

export default function Editor(props: EditorProps) {
    const monaco = useMonaco()
    const valueGetter = useRef<() => string>();

    const onMount: OnMount = (editor: editor.IStandaloneCodeEditor) => {
        valueGetter.current = () => editor.getValue();
        if (props.setValueGetter) {
            props.setValueGetter({ getValue: () => valueGetter.current ? valueGetter.current() : undefined });
        }
        if (!monaco) {
            return
        }
        editor.addAction({
            id: 'my-unique-id',
            label: 'my label',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
            ],
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 1.5,
            run: ed => {
                console.log("Ctrl+S => " + ed.getPosition());
            }
        })
    }

    return (
        <MonacoEditor
            value={props.value}
            language={props.language || "json"}
            theme="vs-dark"
            options={{
                //renderLineHighlight : 'none',
                ...props.options,
                language: props.language || "json",
            }}
            onMount={ onMount }
            onChange={ props.onChange }
        />
    )
}