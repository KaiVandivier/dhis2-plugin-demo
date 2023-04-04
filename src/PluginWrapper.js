import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import classes from './PluginWrapper.module.css'
import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import postRobot from '@krakenjs/post-robot'

// "ANC 3 coverage by districts last 12 months"
// This is copied here, because the dashboard app does some custom
// transformations to this visualization object, and can't just pass an
// ordinary visualization object 😢
const visualizationHack = {
    href: 'https://debug.dhis2.org/dev/api/41/visualizations/DkPKc1EUmC2',
    name: 'ANC: 1-3 trend lines last 12 months',
    created: '2014-04-16T11:04:55.400',
    lastUpdated: '2022-03-22T09:01:08.115',
    translations: [],
    publicAccess: '--------',
    userGroupAccesses: [
        {
            access: 'r-------',
            displayName: 'Malaria program',
            userGroupUid: 'jvrEwEJ2yZn',
            id: 'jvrEwEJ2yZn',
        },
        {
            access: 'rw------',
            displayName: 'HIV Program Coordinators',
            userGroupUid: 'Rg8wusV7QYi',
            id: 'Rg8wusV7QYi',
        },
    ],
    userAccesses: [],
    access: {
        manage: false,
        externalize: true,
        write: false,
        read: true,
        update: false,
        delete: false,
    },
    digitGroupSeparator: 'SPACE',
    sortOrder: 0,
    topLimit: 0,
    aggregationType: 'DEFAULT',
    completedOnly: false,
    hideTitle: false,
    hideSubtitle: false,
    interpretations: [
        {
            created: '2023-04-16T11:07:06.528',
            id: 'MC8iaQ5ojv6',
        },
    ],
    subscribers: [],
    columns: [
        {
            items: [
                {
                    name: 'ANC 1 Coverage',
                    dimensionItemType: 'INDICATOR',
                    displayName: 'ANC 1 Coverage',
                    displayShortName: 'ANC 1 Coverage',
                    id: 'Uvn6LCg7dVU',
                },
                {
                    name: 'ANC 2 Coverage',
                    dimensionItemType: 'INDICATOR',
                    displayName: 'ANC 2 Coverage',
                    displayShortName: 'ANC 2 Coverage',
                    id: 'OdiHJayrsKo',
                },
                {
                    name: 'ANC 3 Coverage',
                    dimensionItemType: 'INDICATOR',
                    displayName: 'ANC 3 Coverage',
                    displayShortName: 'ANC 3 Coverage',
                    id: 'sB79w2hiLp8',
                },
            ],
            dimension: 'dx',
        },
    ],
    rows: [
        {
            items: [
                {
                    name: 'LAST_12_MONTHS',
                    dimensionItemType: 'PERIOD',
                    displayShortName: 'LAST_12_MONTHS',
                    displayName: 'LAST_12_MONTHS',
                    id: 'LAST_12_MONTHS',
                },
            ],
            dimension: 'pe',
        },
    ],
    filters: [
        {
            items: [
                {
                    name: 'Sierra Leone',
                    dimensionItemType: 'ORGANISATION_UNIT',
                    displayName: 'Sierra Leone',
                    displayShortName: 'Sierra Leone',
                    id: 'ImspTQPwCqd',
                },
            ],
            dimension: 'ou',
        },
    ],
    parentGraphMap: {
        ImspTQPwCqd: '',
    },
    type: 'LINE',
    reportingParams: {
        grandParentOrganisationUnit: false,
        parentOrganisationUnit: false,
        organisationUnit: false,
        reportingPeriod: false,
    },
    rowTotals: false,
    colTotals: false,
    rowSubTotals: false,
    colSubTotals: false,
    regressionType: 'NONE',
    hideEmptyRowItems: 'NONE',
    displayDensity: 'NORMAL',
    fontSize: 'NORMAL',
    yearlySeries: [],
    showData: false,
    skipRounding: false,
    regression: false,
    cumulativeValues: false,
    percentStackedValues: false,
    showHierarchy: false,
    showDimensionLabels: false,
    hideEmptyRows: false,
    hideEmptyColumns: false,
    fixColumnHeaders: false,
    fixRowHeaders: false,
    noSpaceBetweenColumns: false,
    subscribed: false,
    displayName: 'ANC: 1-3 trend lines last 12 months',
    favorite: false,
    user: {
        id: 'GOLswS44mh8',
        code: null,
        name: 'Tom Wakiki',
        displayName: 'Tom Wakiki',
        username: 'system',
    },
    id: 'DkPKc1EUmC2',
    legend: {
        showKey: false,
    },
    seriesKey: {
        hidden: false,
    },
}
export default function PluginWrapper({ style }) {
    const iframeRef = useRef()
    const { baseUrl } = useConfig()

    const pluginProps = useMemo(
        () => ({
            isVisualizationLoaded: true,
            forDashboard: true,
            displayProperty: 'name',
            visualization: visualizationHack,
            onError: () => 'todo',
        }),
        []
    )

    const iframeSrc =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3002/plugin.html'
            : `${baseUrl}/dhis-web-data-visualizer/plugin.html`

    useEffect(() => {
        if (iframeRef?.current) {
            const listener = postRobot.on(
                'getProps',
                // listen for messages coming only from the iframe rendered by this component
                { window: iframeRef.current.contentWindow },
                () => {
                    return pluginProps
                }
            )

            return () => listener.cancel()

            // todo: send new props when they change (probably a separate useEffect)
            // postRobot.send(
            //     iframeRef.current.contentWindow,
            //     'newProps',
            //     pluginProps
            // )
        }
    }, [pluginProps])

    return (
        <div className={classes.wrapper}>
            {iframeSrc ? (
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    // preserve dimensions if provided
                    style={{
                        width: style.width || '100%',
                        height: style.height || '100%',
                        border: 'none',
                    }}
                ></iframe>
            ) : null}
        </div>
    )
}
