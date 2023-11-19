'use client'

import {useEffect, useState} from "react";

import server_connection from "../app/axios_connection";
import {search} from '../services/location'

import Dialog from '@mui/material/Dialog'
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import LoadingButton from "@mui/lab/LoadingButton";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

export const openForm = (setForm, router, url, method, title, fields, disableButton, redirectURL) => {
    setForm(
        <Form
            router={router}
            url={url}
            redirectURL={redirectURL}
            method={method}
            title={title}
            open={true}
            closeForm={() => {closeForm(setForm)}}
            fields={fields}
            disableButton={disableButton}
        />
    )
}

export const closeForm = (setForm) => {
    setForm('')
}

export default function Form({router, url, method, redirectURL, title, description, open, closeForm, fields, disableButton}) {
    const [components, setComponents] = useState(null)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [fileUploaded, setFileUploaded] = useState(null)
    const [places, setPlaces] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget), o = {}
        data.forEach((value, key) => {
            if (value !== undefined && value !== '') o[key] = value
        })

        let headers, r

        if (data.get('file') !== null) {
            headers = {
                "Content-Type": "multipart/form-data"
            }
        } else {
            headers = {
                "Content-Type": "application/json"
            }
        }

        if (data.get('file') !== null && data.get('file').name === '') {
            setFileUploaded(false)
        } else {
            setFormSubmitted(false)
            if (method === 'post') r = await server_connection.post(url, o, {headers: headers})
            else r = await server_connection.get(url)

            if (r.data.status === 'OK') {
                if (r.data.networkData) localStorage.setItem('data', JSON.stringify(r.data.networkData))
                if (redirectURL) {
                    closeForm()
                    if (redirectURL === window.location.pathname) {

                        window.location.reload()
                    } else {
                        router.push(redirectURL, {data: 'some data'})
                    }
                }
                else {
                    closeForm()
                    window.location.reload();
                }
            } else {
                setFormSubmitted(false)
                setErrorMessage(r.data['status'])
            }
        }
    }

    useEffect(() => {
        let array = []

        fields.forEach((field, index) => {
            if (field.name === 'location') {
                array.push(
                    <Autocomplete
                        key = {field.name}
                        sx={{mt: 1}}
                        margin='normal'
                        fullWidth
                        freeSolo
                        id="location"
                        disableClearable
                        options={places.map((place) => place)}
                        onInputChange={async (event, value) => {
                            if (value.length > 2) setPlaces(await search(value))
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option}>
                                    {option}
                                </li>
                            )
                        }}
                        renderTags={(tagValue, getTagProps) => {
                            return tagValue.map((option, index) => (
                                <Chip {...getTagProps({index})} key={option} label={option}/>
                            ))
                        }}
                        renderInput={(params) => (
                            <TextField
                                required
                                name='location'
                                {...params}
                                label="Enter location (city)"
                                InputProps={{
                                    ...params.InputProps,
                                }}
                            />
                        )}
                    />
                )
            } else if (field.type === 'text' || field.type === 'password' || field.type === 'email') {
                array.push(
                    <TextField
                        key={field.name}
                        type={field.type}
                        margin="normal"
                        required={field.required}
                        fullWidth
                        id={field.label}
                        label={field.label}
                        name={field.name}
                        autoComplete={field.label}
                        autoFocus={index === 0}
                    />
                )
            } else if (field.type === 'date') {
                array.push(
                    <DatePicker
                        key={field.name}
                        sx = {{mt: 1, width: '100%'}}
                        id={field.label}
                        label={field.label}
                        slotProps = {{
                            textField: {
                                inputProps: {
                                    name: field.name,
                                    required: field.required
                                }
                            }
                        }}
                        autoComplete={field.label}
                    />
                )
            } else if (field.type === 'file') {
                array.push(
                    <Button key={field.name} sx={{mt: 3}} variant="contained" component="label">
                        {field.label}
                        <input name={field.name} type={field.type} required={field.required} hidden/>
                    </Button>
                )
            }
        })

        setComponents(array)
    }, [places]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={closeForm}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {description ? <DialogContentText></DialogContentText> : null}
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 1, mb: 1, minWidth: {md: 500}}}>
                        {components}
                        {fileUploaded === false ?
                            <Alert sx={{mt: 2}} severity="warning">Please upload file!</Alert> : null}
                        {errorMessage !== '' ?
                            <Alert sx={{mt: 2}} severity="warning">{errorMessage}</Alert> : null}
                        {disableButton ?
                            null
                            :
                            <LoadingButton
                                loading={formSubmitted}
                                sx={{mt: 2}}
                                type="submit"
                                fullWidth
                                variant="contained"
                                endIcon={<ArrowForwardIosRoundedIcon/>}
                            >
                                Submit
                            </LoadingButton>
                        }
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeForm}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    )
}