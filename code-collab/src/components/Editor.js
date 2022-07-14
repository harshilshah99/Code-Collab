import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import Dropdown from 'react-bootstrap/Dropdown';


const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [runcode, setRuncode] = useState('');
    const [result, setResult] = useState('');
    const [language, setLanguage] = useState('python');
    const [extension, setExtension] = useState('py')

    //Compiling code
    const run = () => {

        axios
            .post(`http://localhost:5000/${language}`, { runcode })
            .then(
                ({ data }) => {
                    setResult(data);
                }
            );
    }

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }

            );

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                setRuncode(code);

                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, []);


    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    //Settinf language and extension for various code languages
    const python = () => {
        setLanguage('python');
        setExtension('py');
    };
    const node = () => {
        setLanguage('node');
        setExtension('js');
    }
    const c = () => {
        setLanguage('c');
        setExtension('c');
    }
    const cpp = () => {
        setLanguage('cpp');
        setExtension('cpp');
    }
    const java = () => {
        setLanguage('java');
        setExtension('java');
    }

    //Download code file
    const downloadTxtFile = () => {
        const element = document.createElement("a");
        console.log(runcode);
        const file = new Blob([`${runcode}`], {
            type: "text/plain"
        });

        element.href = URL.createObjectURL(file);
        element.download = `Code-Collab.${extension}`;
        document.body.appendChild(element);
        element.click();
    };

    return (
        <>
            <textarea id="realtimeEditor" ></textarea>
            <div className='editor-buttons'>
                <Button className='all-btn' style={{ marginRight: '1rem', backgroundColor: 'rgb(77, 103, 195)', border: 'none' }} onClick={downloadTxtFile}>Save</Button>
                <Dropdown>
                    <Dropdown.Toggle className='all-btn' style={{ backgroundColor: '#4d67c3', border: 'none', borderRadius: '7px' }} id="dropdown-basic">
                        {language}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={node}>javascript</Dropdown.Item>
                        <Dropdown.Item onClick={python}>python</Dropdown.Item>
                        <Dropdown.Item onClick={c}>c</Dropdown.Item>
                        <Dropdown.Item onClick={cpp}>cpp</Dropdown.Item>
                        <Dropdown.Item onClick={java}>java</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button onClick={run} className='runbutton' style={{ backgroundColor: 'rgb(231 11 56 / 78%)', border: 'none' }}>Run</Button>
            </div>
            <h5 style={{ fontFamily: '\'Baloo Bhaijaan 2\' , cursive', color: 'white', margin: '1rem' }}>OUTPUT</h5>
            <p style={{ color: 'white', fontFamily: '\'Baloo Bhaijaan 2\' , cursive', color: 'white', margin: '4px', fontWeight: '200', paddingLeft: '1rem' }}>{result}</p>
        </>
    )

};

export default Editor;