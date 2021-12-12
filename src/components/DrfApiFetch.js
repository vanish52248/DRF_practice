// ------------------------------------------------------------------------
// CRUD機能をreactとDRFで紐づけするモジュール
// api側は
// ------------------------------------------------------------------------

import React, {useState, useEffect} from 'react'
import axios from 'axios'

const DrfApiFetch = () => {
    
    // ------------------------------------------------------------------------
    // 各状態管理を行うuseState
    // ------------------------------------------------------------------------

    // 現在表示されているタスクの管理
    const [tasks, setTasks] = useState([])

    // 詳細表示するタスクの管理
    const [selectedTask, setSelectedTask] = useState([])

    // 編集/新規作成する際のタスクの管理
    const [editedTask, setEditedTask] = useState({id: '', title: ''})

    // 現在のIDの管理、デフォルトはID=1
    const [id, setId] = useState(1)

    // ------------------------------------------------------------------------
    // 初回ロード時のみ読み込むメソッド
    // ------------------------------------------------------------------------
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/tasks/',{
            headers: {
                'Authorization': 'Token 7c9833216e73bbaf960ae35de1a47365bee76053'
            }
        })
        .then(  res => {setTasks(res.data)})
    }, [])

    // ------------------------------------------------------------------------
    // Taskをid毎に表示させるメソッド
    // ------------------------------------------------------------------------
    const getTask = () => {
        axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`,{
            headers: {
                'Authorization': 'Token 7c9833216e73bbaf960ae35de1a47365bee76053'
            }})
            .then(res => {setSelectedTask(res.data)
        })
    }

    // ------------------------------------------------------------------------
    // Taskをid毎に削除するメソッド
    // ------------------------------------------------------------------------
    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`,{
            headers: {
                'Authorization': 'Token 7c9833216e73bbaf960ae35de1a47365bee76053'
            }})
            // 今削除したもの以外を表示する → リロードせずに削除した瞬間に再表示
            .then(res => {
                setTasks(tasks.filter((task) => task.id !== id));
                setSelectedTask([]);
                if (editedTask.id === id) {
                    setEditedTask({id: "", title: ""});
                }
            });
    };

    // ------------------------------------------------------------------------
    // Taskを新規作成するメソッド
    // ------------------------------------------------------------------------
    const newTask = (task) => {

        // axios 第二引数用の変数
        const data = {
            title: task.title
        }

        // データを渡す場合は第二引数にデータを渡すことができる(json形式)
        axios.post(`http://127.0.0.1:8000/api/tasks/`, data,{
            headers: {
                // POSTやPUTでDBに値を渡す際にはContent-Typeの設定必須
                'Content-Type': 'application/json',
                'Authorization': 'Token 7c9833216e73bbaf960ae35de1a47365bee76053'
            }})
            // ...でtasksを分解して追加で新しいオブジェクトを作成(res.data)
            .then(res => {setTasks([...tasks, res.data]); setEditedTask({id: '', title: ''})}
        )
    }

    // ------------------------------------------------------------------------
    // Taskを編集(更新)するメソッド
    // ------------------------------------------------------------------------
    const editTask = (task) => {

        axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task,{
            headers: {
                // POSTやPUTでDBに値を渡す際にはContent-Typeの設定必須
                'Content-Type': 'application/json',
                'Authorization': 'Token 7c9833216e73bbaf960ae35de1a47365bee76053'
            }})
            .then(res => {setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)));
                setEditedTask({id: '', title: ''})
        })
    }

    // ------------------------------------------------------------------------
    // Taskを新規作成するメソッド
    // ------------------------------------------------------------------------
    // 入力フォームに変化があるたびにeditedに結果を反映する
    const handleInputChange = () => event => {
        // inputの中のvalue={editedTask.title}の値をとってくる
        const value = event.target.value;
        // inputの中のname='title'のtitleの部分の値をとってくる
        const name = event.target.name;
        // titleだけ上書きする処理
        setEditedTask({...editedTask, [name]:value})
    }



    // ------------------------------------------------------------------------
    // レンダリング
    // ------------------------------------------------------------------------
    return (
        <div>
            <ul>
                {
                    // tasksのレコードごとにidとtitleを表示する
                    tasks.map(task => <li key={task.id}> {task.title}  {task.id}
                    <button onClick={()=>deleteTask(task.id)}>
                        {/* public/index.htmlのリンクタグにfontawesomeからのリンクを持ってくれば使える 削除ボタン */}
                        <i className='fas fa-trash-alt'></i>
                    </button>
                    <button onClick={()=>setEditedTask(task)}>
                        {/* public/index.htmlのリンクタグにfontawesomeからのリンクを持ってくれば使える 編集ボタン */}
                        <i className='fas fa-pen'></i>
                    </button>
                    </li>)
                }
            </ul>

            Set id<br />
            {/* 入力フォームで数値の変化(タイピング)があるたびにSetIdで入力フォームにある数値をsetIdにその都度設定する */}
            <input type="text" value={id} onChange={event=>{setId(event.target.value)}} />
            <br />
            <button type="button" onClick={()=>getTask()}>Get Task</button>
            {/* <button type="button" onClick={()=>deleteTask()}>Delete</button> */}
            <h3>{selectedTask.title} {selectedTask.id}</h3>

            <input type="text" name="title" value={editedTask.title} onChange={handleInputChange()} placeholder='New Task ?' required />

            {/* editedTask（id）が存在するならUpdateボタンを有効化 */}
            {/* editedTask（id）が存在しないならCreateボタンを有効化 */}
            {editedTask.id ?
            <button onClick={()=> editTask(editedTask)}>Update</button> :
            <button onClick={()=> newTask(editedTask)}>Create</button> }
        </div>
    )
}

export default DrfApiFetch
