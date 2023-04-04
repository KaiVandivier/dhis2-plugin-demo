import React from 'react'
import classes from './App.module.css'
import PluginWrapper from './PluginWrapper'

const MyApp = () => (
    <div className={classes.container}>
        <PluginWrapper style={{ width: '400px', height: '300px' }} />
        {/* <dhis2-plugin
            type="visualization"
            id={visualizationId}
            filters={filters}
        /> */}
    </div>
)

export default MyApp
