import React, { useState, useEffect } from "react"

import { all as allSchemas } from "../domain/schemas/api"

import { Select, SelectOption, SelectOptionObject } from "@patternfly/react-core"

type SchemaSelectProps = {
    value?: string
    onChange(schema: string | undefined, id: number | undefined): void
    disabled?: string[]
    noSchemaOption?: boolean
    isCreatable?: boolean
}

interface Schema extends SelectOptionObject {
    name: string
    id: number
    uri: string
}

/* This is going to be a complex component with modal for Extractor definition */
export default function SchemaSelect(props: SchemaSelectProps) {
    const [isExpanded, setExpanded] = useState(false)
    const [options, setOptions] = useState<Schema[]>([])
    const noSchemaAllowed = props.noSchemaOption || false
    useEffect(() => {
        if (props.value || options.length > 0) {
            return
        }
        // TODO: this is fetching all schemas including the schema JSONs
        allSchemas().then((response: Schema[]) => {
            const schemas = response.map(s => {
                return { name: s.name, id: s.id, uri: s.uri, toString: () => `${s.name} (${s.uri})` }
            })
            setOptions(schemas)
            if (!noSchemaAllowed && !props.value && schemas.length > 0) {
                props.onChange(schemas[0].uri, schemas[0].id)
            }
        })
    }, [props.onChange, props.value, noSchemaAllowed])
    const extraOptions: Schema[] = []
    if (noSchemaAllowed) {
        extraOptions.push({ name: "", id: 0, uri: "", toString: () => "-- no schema --" })
    }
    return (
        <Select
            aria-label="Select schema"
            isOpen={isExpanded}
            placeholderText="-- no schema --"
            variant={props.isCreatable ? "typeahead" : "single"}
            isCreatable={props.isCreatable}
            createText="Use new schema URI: "
            onToggle={setExpanded}
            selections={options.find(o => o.uri === props.value) || []}
            onClear={() => {
                setExpanded(false)
                props.onChange(undefined, undefined)
            }}
            onSelect={(e, newValue) => {
                setExpanded(false)
                if (typeof newValue === "string") {
                    props.onChange(newValue as string, 0)
                } else {
                    const schema = newValue as Schema
                    props.onChange(schema.uri, schema.id)
                }
            }}
            onCreateOption={value => {
                setOptions([{ name: value, id: 0, uri: value, toString: () => value }, ...options])
                // onSelect runs automatically
            }}
        >
            {[...extraOptions, ...options].map((option, index) => (
                <SelectOption key={index} value={option} isDisabled={props.disabled?.includes(option.uri)}>
                    {option.name ? (
                        option.name === option.uri ? (
                            <code>{option.uri}</code>
                        ) : (
                            <>
                                {option.name} (<code>{option.uri}</code>)
                            </>
                        )
                    ) : (
                        option.toString()
                    )}
                </SelectOption>
            ))}
        </Select>
    )
}
