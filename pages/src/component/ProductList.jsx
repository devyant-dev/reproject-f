import React,{useState,useContext,useEffect,useRef} from 'react'
import axios from 'axios';
import { TeamC } from '../Context';
import { useRouter } from 'next/router';



// 카테고리 페이지


const ProductList = ({visible,setVisible}) => {

    const router = useRouter();
    // console.log(router.query.id)

    const maxLength = 12; // 문자열 길이 설정 (title)

    const arr = ["생일", "결혼", "환갑", "응원", "합격"]

    // 네이버 검색 api 호출
    const [thenApi, setThenApi] = useState();

    // 사러가기 클릭 -> 트리공간에 뿌려주기
    const [Give,SetGive] = useState([]);

    //ver222<-push
    //wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
    //wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww


  
    const {userLogin, setUserLogin} = useContext(TeamC);

    const [bottom, setBottom] = useState(null);
    const botObs = useRef(null);
    const numRef = useRef(10);
    const keyWo = useRef();
    
    const a = useRef(true);



    

    //console.log(gift)

    
    // 네이버 검색 api 호출
    const GetApi = (obj)=>{
        keyWo.current = obj;
        
        axios.get(`클라우드타입도메인/search/shop?query=${obj}&display=${numRef.current}`)
        .then((res) => {
            setThenApi(res.data.items)
          });
        }
  
        const dragApi = (obj) => {
  
          axios.get(`클라우드타입도메인/search/shop?query=${obj}&display=${numRef.current}`)
          .then((res) => {
            setThenApi(res.data.items)
            numRef.current+=10
            a.current = true; //3. 2번 완료후 다시 값을 받아온 뒤에 a.current를 true로 바꿔서 드래그 함수를 실행하게 만들어라
          });
        }
  
        useEffect( () => {
          if(thenApi) {
            const observer = new IntersectionObserver(
              entries => {
                if(entries[0].isIntersecting && a.current){ //1. a의 현재값이 트루이면 실행하라
                  dragApi(keyWo.current);
                  a.current = false; // 2. dragApi를 실행하면 false로 바꿔라
                }
              },
              {threshold: 1, rootMargin: '50px'}
            );
            botObs.current = observer;
  
            const observer2 = botObs.current;
            observer2.observe(bottom);
          }
        }, [thenApi]);
        

        // 카테고리 아이템 처음부터 보여주는 코드
        // useEffect( () => {
        //     if(visible)
        //     {GetApi()}},
        //      [visible] )
  
        useEffect(() => {
          // 위시리스트
          userWishListGet();        
        }, [router.query.id,visible]);

        const userWishListGet = () => {
          axios.get('/api/gift',{params:{userLogin:router.query.id}}).then(
            res=>
            SetGive(res.data))
        }

        const searchCg = (e)=>{
          GetApi(e.target[0].value);
          e.preventDefault();
        }
        
        const addToGift = (obj)=>{

          axios.post('/api/gift',{UserID:userLogin.UserID
            ,UserName:userLogin.NickName
            ,title:obj.title
            ,image:obj.image
            ,price:obj.lprice
            ,state:0})

          setVisible(!visible)
          setThenApi();
        }

        ///////////////////////////////////////


  return (
    <div style={{width:"100%",height:"90vh",paddingTop:"30px",  position:"relative"}}>
    
     {/* 카테고리, 카테리고리 검색 보여주는곳 */}
  <div style={{position:"relative", width:"100%"}}>

        {/* sql데이터 기반 화면에 뿌려보기 */}
        {/* {sqlGift?.map((obj, idx) => {
          return <article key={"TestA"+idx}>
            <img src={obj.image} style={{ width: "100px", height: "100px" }} />
            <strong> {obj.title}</strong>
            <span>{obj.price}</span>
          </article>
        })}
        <hr />
        {sqlFriends?.map((obj, idx) => { return <div key={"TestB"+idx}>{obj.NickName}</div> })} */}


    
    {/* 트리공간에 선물 뿌리기 */}

    {/* 선물하기, 삭제하기 박스크기 */}
    <div style={{width:"113%", display:"flex", flexWrap:"wrap", left:"-19px", position:"absolute"}}>

    {Give && Give?.map((obj,idx)=>{
      return(        
      <article key={"Tree"+idx}
      style={{
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과
        background:"rgba(255, 255, 255, 0.5)",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding:"10px",
        margin: "20px",
        width:"41%"
        
        }}>
      <img src={obj.image} style={{ 
        width:"224px",
        height:"177px",
        borderRadius:"20px",

        // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",

        marginBottom:"6px"
        }}/>
      <strong style={{fontFamily:"Neo3", padding:"6px"}}> {obj.title.replaceAll("<b>","").replaceAll("</b>","").substr(0, maxLength) + (obj.title.length > maxLength ? "..." : "")}</strong>
      <span>{obj.lprice}</span>



      {obj.UserID == userLogin.UserID?

<button onClick={()=>{axios.delete(
  '/api/gift',{params:{ItemID:obj.id}
  
}
);userWishListGet()

}}style={{
  background: "#b2d3e1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px",
    cursor: "pointer",
    margin: "5px",

    // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
}}
>삭제하기</button>
      
      
      :<button onClick={()=>{
        console.log(obj,'선물클릭');
        axios.put(
        '/api/gift',{
          ItemID:obj.id,
          GiverID:userLogin.UserID,
          GiverName:userLogin.NickName
        }
      );userWishListGet()
      
      }} style={{
          background: "#b2d3e1",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
          margin: "5px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // 그림자 효과
      }}>선물하기</button>
      }
      </article>
      
      )
    })}
    </div>
    
    {/* <h3>쇼핑카트</h3> */}
    <div style={{ 
      // background:"#f9e9ee",
      width:"100%",
      height:"70vh",
      position:"absolute",
      top:0,
      left:0,
      display:visible?"block":"none",
      overflow:"auto",
      borderRadius: "10px",
      top:"0px",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
      backgroundColor: "#f9e9ee",

      // backdropFilter:"blur(10px)",
      zIndex:"1"
      }}>
      <article style={{display:"flex",justifyContent:"space-around"}}>
        <form onSubmit={ (e)=>{searchCg(e)} } 
        // style={{transform:"translateY(-11px)"}}
        >
        <input 

          color='#000'
          type="text" 
          placeholder='원하는 품목을 찾아보세요.'

          style={{ 
            height: "50px", 
            margin: "20px",
            borderRadius: "10px", // 라디우스 조정
            fontSize: "14px", // 폰트 크기 조정
            width: "265px", // 너비 조정
            border: "none", // 검은색 보더 제거
            outline: "none", // 클릭 시 파란색 아웃라인 제거
            padding: "10px", // 내부 여백 조정

            backgroundColor:"#fff"
            // background: "rgba(255, 255, 255, 0.5)", // 투명도 조정
            // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과
            }}
        
        />
        <button type='submit'
           style={{
            backgroundColor: "#b2d3e1",
            border: "none",
            color: "white",
            padding: "15px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            fontSize: "16px",
            borderRadius: "10px",
            cursor: "pointer",
            width: "71px",
            height: "50px",
            

            // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과
            }}
        
        >검색</button>
        </form>
       
      </article>

        <ul style={{
           margin:"20px",
           display: "flex",
           listStyle: "none",
           paddingBottom:"5%",
           justifyContent: "space-around",
           alignItems: "center",

          backgroundColor:"#fff",
          //  background: "rgba(255, 255, 255, 0.5)", // 투명도 조정
          //  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과

           borderRadius: "10px", // 라운드 처리
          // display:"flex", listStyle:"none", padding:"2%", justifyContent:"space-around", alignItems:"center"
          }}>
        
        {/* 배열에 넣어둔 카테고리 목록 노출 */}
        {arr.map((obj,idx)=>{
            return <li onClick={ ()=>{GetApi(obj)} } 
            style={{
              fontFamily: "Neo3, sans-serif",backgroundColor:"#b2d3e1",width:58,height:58,margin:"1.5%", textAlign:"center",alignItems:"center", borderRadius:"50%",
              // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
            }} 
            key={"categoryList"+idx}> 
            <figure style={{overflow:"hidden"}}>
            <img src={`/img/${obj}.jpg`}
            style={{
              width: "58px",
              height: "58px",
              objectFit:"cover",
              borderRadius: "50%",
              boxShadow:"0 4px 12px rgba(0, 0, 0, 0.3)"
            }}/>  </figure> <span>{obj}</span> </li>
        })}
        </ul>

        
        {/* 카테고리 클릭시 나오는 아이템목록22222 */}
        <div style={{width:"104%", display:"flex", flexWrap:"wrap"}}>

          {thenApi && thenApi.map((obj, idx)=>{
            return <div key={"shopping" + idx}
              style={{
                
                backgroundColor:"#fff",
                // background: "rgba(255, 255, 255, 0.5)",
                // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)", 
                
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                padding:"10px",
                margin: "20px",
                width:"41%"
              }}>

              <img src={obj.image} style={{ width:"206px", height:"177px", borderRadius:"10px"}} alt="product" />
        <figcaption
        style={{
          width: "100%",
          padding: "10px, 10px, 10px",
          display: "block",
          textAlign:"center",
          paddingTop: "7",

          // display: "flex",
          // flexDirection: "column",
          // justifyContent: "space-between",
          // alignItems: "center",

          flexGrow: "1",
          }}>
        <span>{obj.title.replaceAll("<b>","").replaceAll("</b>","").substr(0, maxLength) + (obj.title.length > maxLength ? "..." : "") }</span>
        <p style={{paddingBottom:"10px", paddingTop:"10px"}}> {obj.lprice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
        <div
        style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "74%",
        }}
        >
        <button onClick={()=>{window.open(`${obj.link}`, 'window_name', 'width=430, height=500, location=no, status=no,  scrollbars=yes')}}
        style={{
          background: "#f2cfda",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
          margin: "5px",

          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과

        }}>
        보러가기</button>
         <button onClick={ ()=>{addToGift(obj)} }
         style={{
          background: "#b2d3e1",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "10px",
          cursor: "pointer",
          margin: "5px",
          
          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과
          
         }}
         >담아두기</button>
        </div>
      </figcaption> 
 
             </div>})}

        </div>

    <div ref={setBottom} style={{opacity:0}}>바닥</div>
              

    </div>
    </div>

    <button 
       style={{
        backgroundColor: "#b2d3e1",
        border: "none",
        color: "white",
        padding: "15px 20px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        borderRadius: "10px",
        cursor: "pointer",
        height: "50px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // 그림자 효과
        transform:"translateY(-100%)",
        position:"absolute",
        bottom:"14%",
        right:"3%",
        zIndex:"0"
        }}
      onClick={() => { setVisible(!visible); } }>WishList
    </button>

    </div>
  )
}

export default ProductList