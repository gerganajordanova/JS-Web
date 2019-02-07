const mongoose=require('mongoose');
const PATH=require('path');
let Image=require('../models/ImageSchema');

module.exports = (req, res) => {
    let htmlPath = PATH.normalize(PATH.join(__dirname, '../views/results.html'));

    if (req.pathname === '/search' && req.method === 'GET') {
        let params = getSearchParams(req.query);
        if (Object.keys(params).length === 0) {
            mongoose.getAllImages().then((images) => {
                let content = getTemplate(images);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                handleResponse(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        } else if (params.hasOwnProperty('tags')) {
            params.limit = params.limit || 10;
            mongoose.searchByTagNameAndDate(params).then((imagesFound) => {
                let content = getTemplate(imagesFound);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                handleResponse(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        } else {
            params.limit = params.limit || 10;
            mongoose.searchByDate(params).then((imagesFound) => {
                let content = getTemplate(imagesFound);
                if (content === '') {
                    content = '<h1>Sorry, no images met your criteria.<h1>';
                }
                handleResponse(res, htmlPath, 'html', content);
            }).catch((err) => {
                console.log(err);
                res.end();
            });
        }
    } else {
        return true;
    }
};

function getSearchParams(query) {
    let result = {};

    if (query.tagName !== '') {
        result.tags = query.tagName.split(/\s*,\s*/).filter(onlyUnique);
    }

    if (query.afterDate !== '') {
        result.after = query.afterDate;
    }

    if (query.beforeDate !== '') {
        result.before = query.beforeDate;
    }

    if (query.limit !== '') {
        result.limit = Number(query.limit);
    }

    return result;
}

function getTemplate(images) {
    let result = '';
    for (let img of images) {
        result += `<div class="image">
       <h2>${img.title}</h2>
       <img src="${img.url}"></img>
       <p>${img.description}</p>
       <button onclick='location.href="/delete?id=${img._id}"'class='deleteBtn'>Delete</button> 
       </div>`;
    }

    return result;
}

function onlyUnique(value, index, self) {
    if (value === '') {
        return false;
    }

    return self.indexOf(value) === index;
}

const FS = require('fs');

function handleResponse(res, path, extension, content) {
    if (extension === 'html') {
        FS.readFile(path, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                res.write('404 not found!');
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            data = data.replace('<div class="replaceMe"></div>', content);
            res.write(data);
            res.end();
        });
    } else {
        const READ = FS.createReadStream(path);

        res.writeHead(200, {
            'Content-Type': getContentType(extension)
        });

        READ.on('open', () => {
            READ.pipe(res);
        });

        READ.on('error', () => {
            res.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            res.write('404 not found!');
            res.end();
        });
    }
}
function getContentType(ext) {
    let extension = ext.split('.').pop();

    if (extension === 'css') {
        return 'text/css';
    } else if (extension === 'ico') {
        return 'image/x-icon';
    } else if (extension === 'jpg' || extension === 'jpeg') {
        return 'image/jpeg';
    } else if (extension === 'png') {
        return 'image/png';
    } else if (extension === 'js') {
        return 'application/javascript';
    }
}
