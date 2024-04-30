export default function getFileType(file: any) {
  if (typeof file === 'string') {
    if (file.split('/')[4] === 'image')
      return 'image';
    else if (file.split('/')[4] === 'video')
      return 'video';
    else
      return 'other';
  } else {
    if (file.type.match('image.*'))
      return 'image';

    if (file.type.match('video.*'))
      return 'video';

    if (file.type.match('audio.*'))
      return 'audio';

    // etc...

    return 'other';
  }
}