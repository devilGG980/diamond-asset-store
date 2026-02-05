
import { blogContent } from './src/data/blogContent';
console.log('Successfully loaded blogContent');
console.log('Number of posts:', Object.keys(blogContent).length);
console.log('Last post key:', Object.keys(blogContent).pop());
