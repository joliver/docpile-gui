## Docpile UI

This project is built on [React](https://reactjs.org/) with [React Router 4](https://www.npmjs.com/package/react-router-dom) using [create-react-app](https://github.com/facebookincubator/create-react-app).

A local version of this app can be run by cloning the repository, installing dependencies (by running `npm install`), and then running `npm start`.

This runs the app locally on a development server with live reloading. To generate a production build use `npm run build`.


#### _Currently in progress: building out and testing API integration and displaying individual elements data._



### Working Chunks

- [X] Initial UI and Navigation
- [X] API integration
- [ ] Display individual elements metadata _(Oct 7, 2018)_
- [ ] List/table view _(Oct 7, 2018)_
- [ ] Forms/submission _(Oct 21, 2018)_
- [ ] Uploading assets _(Nov 4, 2018)_
- [ ] Interactive tag manager _(Nov 18, 2018)_
- [ ] Universal search UI _(Dec 9, 2018)_



### User Stories

- Document Definition
    - I can upload an asset.
    - I can define documents on the asset.
    - I can add a tag to a document.
    - I can create a tag in order to add it to a document.
    - I can create an alias on a tag in order to add it to a document.
    - While adding tags to a document I can see suggested tags and click on them to add them.

- Tag Management
    - I can view all tags.
    - I can create or delete tags and add aliases.
    - I can click on a tag to see its metadata and a list of all documents.

- Documents View
    - I can view all documents and sort/filter by various fields.
    - I can view all documents filtered by tag(s).
    - I can click to view an individual document's metadata.
    - I can click on the related asset to download or preview it.
    - I can delete a document.

- Search
    - I can type criteria in a universal search box that will search documents and tags.
    - I can see suggested tags or documents appear as I type in the search box
    - If I click on a suggested tag, it will add it to the search criteria and clear the search box for a further refined search
    - I can see a list of search results, including documents and tags.
    - I can sort the list of search results.
    - I can click on a tag to see a list of documents for that tag.
    - I can click on a document to view it, then click on a back button to return to search results.