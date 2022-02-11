import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Comment, Divider, Form, Loader, Segment, TextArea } from "semantic-ui-react";
import { deletePropertyNote, postPropertyComment } from "../../actions/actions_properties";

export default function CommentSection({dispatch, active_property, user_email, google_image_url, active_property_comments, moreSection}){
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingComments, setLoadingComments] = useState([])

    useEffect(() => {
        setLoading(false)
        setComment("")
        setLoadingComments([])
        // console.log('moreSection', moreSection)
        // console.log(active_property_comments)
        if(active_property_comments){
            if(moreSection){
                const sortedArray = active_property_comments.sort((a,b) => new Date(a.date) - new Date(b.date) );
                const filteredArray = sortedArray.filter(comment => comment.section === 'more')
                setComments(filteredArray)

            }
            else {
                const sortedArray = active_property_comments.sort((a,b) => new Date(a.date) - new Date(b.date));
                const filteredArray = sortedArray.filter(comment => comment.section !== 'more')

                setComments(filteredArray)
            }
        }
    }, [active_property_comments]);

    const postComment = () => {
        // console.log(comment)
        // console.log(user_email)
        // console.log(active_property.ID)
        // console.log(moreSection)
        // console.log(google_image_url)
        setLoading(true)
        dispatch(postPropertyComment(active_property.ID, comment, user_email, moreSection, google_image_url))

    }

    const deleteNote = (comment, i) => {
        const clone = JSON.parse(JSON.stringify(loadingComments))
        clone.push(i)
        setLoadingComments(clone)
        dispatch(deletePropertyNote(comment.content, comment.username, comment.ID, comment.date))
    }
    return(
        <div>
            <div style={{height:'100'}}>
                <Segment className='custom-comments'>
                    <Comment.Group>
                    {
                        comments.map((comment, i) => {
                            const date = moment(new Date(comment.date), "YYYYMMDD").fromNow();
                            return(
                                <div key={i}>
                                    <Comment >
                                        {comment.username === user_email && <div style={{position:'absolute', right:-5, top:-10, cursor:loadingComments.includes(i) ? 'unset':'pointer'}} onClick={() => loadingComments.includes(i) ? null : deleteNote(comment, i)}>{loadingComments && loadingComments.includes(i) ? <Loader inline active size="mini" /> : <img style={{height:'10px'}} src="../img/icons/red/x-red.svg" />}</div>}
                                        <Comment.Avatar  style={{borderRadius:'100%'}} src={comment.image} />
                                        <Comment.Content style={{textAlign:'start', fontsize:10}}>
                                            <Comment.Author  as='a'>{comment.username}</Comment.Author>
                                            <Comment.Metadata>
                                            <div style={{fontSize:10}}>| {date}</div>
                                            </Comment.Metadata>
                                            <Comment.Text style={{marginTop:10, whiteSpace:"pre-line"}}>{comment.content}</Comment.Text>
                                        </Comment.Content>
                                    </Comment>
                                    {i !== comments.length -1 &&  <Divider />}
                                </div>
                            )
                        })
                    }

                    </Comment.Group>
                    <div style={{margin: '15px'}}>
                        <Form>
                            <TextArea style={{boxShadow: '0px 0px 7px rgba(0, 0, 0, 0.15)', fontSize:10}} value={comment} onChange={(e, data) => setComment(data.value)} placeholder='Write your note here...' />
                            <Button loading={loading} disabled={loading || comment.length === 0} onClick={postComment} style={{marginTop: 10}} className="atd-button">Submit</Button>

                        </Form>

                    </div>
                </Segment>
            </div>

        </div>
    )
}
