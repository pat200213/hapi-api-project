const {nanoid} = require('nanoid');
const bookshelf = require('./bookshelf')

// save book handler
const addBookHandler = (request, h) => {
    const {name, year, author, summary, 
        publisher, pageCount, readPage, reading
    } = request.payload;

    // check parameter
    if(name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);

        return response;
    }

    if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        }).code(400);

        return response;
    }

    // initial other parameter not sending
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    // save process
    const newBook = {
        name, year, author, summary, 
        publisher, pageCount, readPage, 
        reading, id, insertedAt, updatedAt, finished
    };

    bookshelf.push(newBook);

    // response if book saved
    const isSuccess = bookshelf.filter(
                        (book) => book.id === id
                    ).length > 0;

    if(isSuccess){
        const response = h.response({
            status: 'success',
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id
            }
        }).code(201);

        return response;
    }
    else{
        const response = h.response({
            status: 'fail',
            message: "Buku gagal ditambahkan",
            
        }).code(500);

        return response;
    }
};

// show all book handler
const getAllBookHandler = (request, h) => {
    const {name, reading, finished} = request.query;

    if(name){
        const list_book = bookshelf.filter(
                                (book) => book.name.toLowerCase() === name.toLowerCase()
                            );
    
        const response = h.response({
            status: 'success',
            data: {
                books: list_book.map((book) => ({
                            id: book.id,
                            name: book.name,
                            publisher: book.publisher
                        }))
            }
        }).code(200);   

        return response;
    }

    if(reading){
        const list_book = bookshelf.filter(
                            (book) => Number(book.reading) === reading
                        );

        const response = h.response({
                status: 'success',
                data: {
                books: list_book.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            }).code(200);   

        return response;
    }

    if(finished){
        const list_book = bookshelf.filter(
                            (book) => Number(book.finished) === finished
                        );

        const response = h.response({
                status: 'success',
                data: {
                books: list_book.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            }).code(200);   

        return response;
    }

    if(!name && !reading && !finished){
       
        const response = h.response({
                status: 'success',
                data: {
                    books: bookshelf.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher
                    }))
                }
            }).code(200);   

        return response;
    }

    return {
        status: 'success',
        data: {
            books: []
        }
    };

};

// show spesific book handler
const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;

    const list_book = bookshelf.filter(
                            (book) => book.id === bookId
                        )[0];

    if(list_book){ 
    
        const response = h.response({
            status: 'success',
            data: {
                book: list_book
            }
        }).code(200);   

        return response;
    }

    return h.response({
        status: 'fail',
        message: "Buku tidak ditemukan"
    }).code(404);

};

// update spesific book handler
const updateBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary,
            publisher, pageCount, readPage, reading
        } = request.payload;

    if(!name){
       
        return h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        }).code(400);   

    }

    if(readPage > pageCount){
       
        return h.response({
            status: 'fail',
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);   

    }

    const updatedAt = new Date().toISOString();
    const index = bookshelf.findIndex((b) => b.id === bookId);

    if(index !== -1){ 
        bookshelf[index] = {
            ...bookshelf[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        };

        return h.response({
            status: 'success',
            message: "Buku berhasil diperbarui"
        }).code(200);

    }

    return h.response({
        status: 'fail',
        message: "Gagal memperbarui buku. Id tidak ditemukan"
    }).code(404);


};

// delete spesific book handler
const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = bookshelf.findIndex((b) => b.id === bookId);

    if(index !== -1){ 
        bookshelf.splice(index, 1);

        return h.response({
            status: 'success',
            message: "Buku berhasil dihapus"
        }).code(200);

    }

    return h.response({
        status: 'fail',
        message: "Buku gagal dihapus. Id tidak ditemukan"
    }).code(404);


};


module.exports = {addBookHandler, getAllBookHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler};