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


const UploadVideo = (props) => {
    const dispatch = useDispatch()
    const [vfiles, setFiles] = useState([])
    const { getRootProps, getInputProps } = useDropzone({
        accept: ".mkv,.mp4",
        onDrop: (acceptedFiles) => {
            let newFile = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
            }))
            setFiles(oldFiles => [...oldFiles, ...newFile])
        }
    });

    function removeImage(index) {
        setFiles(vfiles => vfiles.filter((s,i)=>(i != index)))
    }

    useEffect(() => {
        props.addFiles(vfiles)
    }, [vfiles])

    return (
        <DropzoneStyle>
            <DropzoneUploadCard {...getRootProps()}>
                <input {...getInputProps()} />
                <p>
                    Upload your Video
                </p>
            </DropzoneUploadCard>
            <Card sx={{ marginTop: '10px' }}>{
                vfiles.map((vfiles, index) => (
                    <ImageCard key={index}>
                        <DeleteIcon onClick={() => removeImage(index)} />
                        <IconButton aria-label="delete" sx={{ position: 'absolute', right: 0, top: 0 }} >
                        </IconButton>

                        <video className="VideoInput_video" width="100%" height="auto" controls src={vfiles.preview} />
                        {/* <img src={file.preview} style={{ width: '100%', height: "auto" }} /> */}
                    </ImageCard>
                ))
            }</Card>
        </DropzoneStyle>
    )

}

export default UploadVideo;