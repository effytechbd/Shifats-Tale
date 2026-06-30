<!-- BEGIN:user-custom-rules -->
# UI & UX Guidelines
1. **Use Professional Toasters**: Whenever saving changes in admin panels, do NOT use inline text success messages that require the user to scroll up. Use a professional popup/toaster like eact-hot-toast (	oast.success(...)).
2. **React App Router State Sync**: When using outer.refresh() to update server data after a form submit, remember that useState initialized with initialData will NOT automatically reset unless you use useEffect to sync the new initialData to state, or add a key to the component to force unmount. This avoids bugs where 'picture upload is not reflecting after save'.
<!-- END:user-custom-rules -->

3. **Media Selection Strategy**: Wherever there is an image/media input in the CMS, always provide two options: 'Upload' (upload new file) and 'Choose' (select from existing uploaded media in the database). Avoid forcing the user to upload the same image multiple times.
