import { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { uploadReportImage } from 'src/store/api/report';

const DropzoneStyle = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    borderRadius: Number(theme.shape.borderRadius),
}));

const DropzoneUploadCard = styled(Card)(({ theme }) => ({
    boxShadow: `${theme.shadows[3]} !important`,
    border: `1px solid ${alpha(theme.palette.common.black, .2)}`,
    padding: theme.spacing(2, 0),
    textAlign: 'center',
    borderRadius: Number(theme.shape.borderRadius),
}));

const ImageCard = styled(Card)(({ theme }) => ({
    boxShadow: `${theme.shadows[3]} !important`,
    textAlign: 'center',
    borderRadius: Number(theme.shape.borderRadius),
    width: '47%',
    display: 'inline-block',
    margin: '.5% 1.5%',
}));


const UploadImage = (props) => {
    const dispatch = useDispatch()
    const [files, setFiles] = useState([])
    const { getRootProps, getInputProps } = useDropzone({
        accept: ".png,.jpg,.jpeg",
        onDrop: (acceptedFiles) => {
            let newFile = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
            }))
            setFiles(oldFiles => [...oldFiles, ...newFile])
        }
    });

    function removeImage(index) {
        setFiles(file => file.filter((s,i)=>(i != index)))
    }

    useEffect(() => {
        props.addFiles(files)
    }, [files])

    return (
        <DropzoneStyle>
            <DropzoneUploadCard {...getRootProps()}>
                <input {...getInputProps()} accept=".png,.jpg,.jpeg" />
                <p>
                    Upload your Image
                </p>
            </DropzoneUploadCard>
            <Card sx={{ marginTop: '10px' }}>{
                files.map((file, index) => (
                    <ImageCard key={index}>
                        <IconButton
                            aria-label="delete"
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0
                            }}
                            onClick={() => removeImage(index)}
                        >
                            <DeleteIcon />
                        </IconButton>
                        <img src={file.preview} style={{ width: '100%', height: "auto" }} />
                    </ImageCard>
                ))
            }</Card>
        </DropzoneStyle>
    )

}

export default UploadImage;