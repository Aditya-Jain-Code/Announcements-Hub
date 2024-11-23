import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import 'react-markdown-editor-lite/lib/index.css';

export default function News({
    _id,
    title: existingTitle,
    slug: existingSlug,
    newscategory: existingNewscategory,
    description: existingDescription,
    tags: existingTags,
    status: existingStatus
}) {

    const [redirect, setRedirect] = useState(false);
    const router = useRouter();

    const [title, setTitle] = useState(existingTitle || '');
    const [slug, setSlug] = useState(existingSlug || '');
    const [newscategory, setNewscategory] = useState(existingNewscategory || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [tags, setTags] = useState(existingTags || '');
    const [status, setStatus] = useState(existingStatus || '');

    // Function to handle news creation or update
    async function createProduct(ev) {
        ev.preventDefault();
        const data = { title, slug, description, newscategory, tags, status };

        if (_id) {
            await axios.put('/api/newsapi', { ...data, _id });
        } else {
            await axios.post('/api/newsapi', data);
        }

        setRedirect(true);
    }

    if (redirect) {
        router.push('/');
        return null;
    }

    const handleSlugChange = (ev) => {
        const inputValue = ev.target.value;
        const newSlug = inputValue.replace(/\s+/g, '-');
        setSlug(newSlug);
    }

    return (
        <>
            <form onSubmit={createProduct} className="addWebsiteform">

                <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />
                </div>

                <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="slug">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="Enter Slug URL"
                        required
                    />
                </div>

                <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="category">Category</label>
                    <select
                        name="category"
                        id="category"
                        value={newscategory}
                        onChange={(e) => setNewscategory(e.target.value)}
                    >
                        <option value="academics">Academics</option>
                        <option value="placements">Placements</option>
                        <option value="events">Events</option>
                        <option value="curricular">Co-curricular</option>
                    </select>
                </div>

                <div className="description w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="description">News Content</label>
                    <MarkdownEditor
                        value={description}
                        onChange={(ev) => setDescription(ev.text)}
                        style={{ width: '100%', height: '400px' }}
                        renderHTML={(text) => (
                            <ReactMarkdown
                                components={{
                                    u: ({ node, ...props }) => <u {...props} />, // Underline support
                                    del: ({ node, ...props }) => <del {...props} />, // Strikethrough support
                                    code: ({ node, inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        if (inline) {
                                            return <code>{children}</code>;
                                        } else if (match) {
                                            return (
                                                <div style={{ position: 'relative' }}>
                                                    <pre
                                                        style={{
                                                            padding: '0',
                                                            borderRadius: '5px',
                                                            overflowX: 'auto',
                                                            whiteSpace: 'pre-wrap'
                                                        }}
                                                        {...props}
                                                    >
                                                        <code>{children}</code>
                                                    </pre>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(children)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '0',
                                                            right: '0',
                                                            zIndex: '1'
                                                        }}
                                                    >
                                                        Copy code
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            return <code {...props}>{children}</code>;
                                        }
                                    },
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        )}
                    />
                </div>

                <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="tags">Tags</label>
                    <select
                        name="tags"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    >
                        <option value="guestlecture">Guest Lecture</option>
                        <option value="edmnights">EDMNights</option>
                        <option value="cultural">Cultural</option>
                        <option value="events">Events</option>
                        <option value="miscellaneous">Miscellaneous</option>
                        <option value="placements">Placements</option>
                        <option value="sports">Sports</option>
                        <option value="academics">Academics</option>
                        <option value="competition">Competition</option>
                    </select>
                </div>

                <div className="w-100 flex flex-col flex-left mb-2" data-aos="fade-up">
                    <label htmlFor="status">Status</label>
                    <select
                        name="status"
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="draft">Draft</option>
                        <option value="publish">Publish</option>
                    </select>
                </div>

                <div className="w-100 mb-2">
                    <button type="submit" className="w-100 addwebbtn flex-center">
                        Save News
                    </button>
                </div>
            </form>
        </>
    );
}
