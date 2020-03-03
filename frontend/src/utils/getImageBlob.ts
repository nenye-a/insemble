export default function getImageBlob(file: File) {
  return new Blob([file], {
    type: file.type,
  });
}
