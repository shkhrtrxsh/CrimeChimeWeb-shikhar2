import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { uploadReportImage } from 'src/store/api/report';

const DropzoneStyle = styled('div')(({ theme }) => ({
    // textAlign: 'center',
    // borderRadius: Number(theme.shape.borderRadius),
}));

const DropzoneUploadCard = styled('div')(({ theme }) => ({
    // boxShadow: `${theme.shadows[3]} !important`,
    // border: `1px solid ${alpha(theme.palette.common.black, .2)}`,
    // padding: theme.spacing(2, 0),
    // textAlign: 'center',
    // borderRadius: Number(theme.shape.borderRadius),
}));

const ImageCard = styled(Card)(({ theme }) => ({
    boxShadow: `${theme.shadows[3]} !important`,
    textAlign: 'center',
    borderRadius: Number(theme.shape.borderRadius),
    width: '200px',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '.5% 1.5%',
}));


const AvatarUpload = (props) => {
    const dispatch = useDispatch()
    const [files, setFiles] = useState([])
    const {preview} = props
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            let newFile = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
            }))
            setFiles(newFile)
        },
        multiple: false
    });

    function removeImage(index) {
        setFiles(file => file.filter((s,i)=>(i != index)))
    }

    useEffect(() => {
        if(preview !== null){
            setFiles([{
                preview:preview
            }])
        }
    }, [preview])

    useEffect(() => {
        props.addFiles(files)
    }, [files])

    return (
        <DropzoneStyle>
            <DropzoneUploadCard {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                    {
                        files.map((file, index) => (
                            <ImageCard key={index}>
                                <img src={file.preview} style={{ width: '100%', height: "auto" }} />
                            </ImageCard>
                        ))
                    }
                </p>
            </DropzoneUploadCard>
        </DropzoneStyle>
    )

}

export default AvatarUpload;