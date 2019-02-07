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

module.exports = handleResponse;