import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import PostPreview from 'components/Postpreview/Postpreview';
import PageNation from 'components/PageNation/PageNation';
import Loading from 'pages/Loading/Loading';
import Error from 'pages/Error/Error';
import instance from 'utils/functions/axios';
import { BoardData, PostPre} from 'utils/functions/type';
import { GoSearch } from "react-icons/go";
import { AppContainer, PageContainer, TopBar, PageName, Squares, PostContainer, ContentFooterWrap, Category } from 'styles/styled';
import { UtilPostWrap, UtilWrap, Search, WritingButton, PostWrap, ContentWrap } from './styled';

export default function Board() {
	const [boardData, setBoardData] = useState<BoardData>({id: 0, name: '', contents: [], page: 0, pages: 0});
	const { id, name, contents, page, pages } = boardData;
	const currentUrl = window.location.href;
	const boardUrl = currentUrl.split('&page=')[0].split('boardId=')[1];
	const pageUrl = currentUrl.split('&page=')[1];
	const navigate = useNavigate();

	const { isLoading, isFetching, error, data  } = useQuery(['board_key', boardUrl, pageUrl],
		() => {
			instance
			.get(`/board?boardId=${boardUrl}&page=${pageUrl}`)
			.then((res) => setBoardData(res.data))
		}, { 
			retry: 0,
			refetchOnWindowFocus: false,
			keepPreviousData: true
		});

	const pageChangeHandler = (page: number) => {
		navigate(`/board?boardId=${id}&page=${page}`);
	};

	if (isFetching || isLoading) return <Loading />

	if (error) return <Error />

	return (
		<>
			<AppContainer>
				<Header />
				<PageContainer>
					<TopBar>
						<PageName>{name}</PageName>
						<Squares>
							<div>&#9866;</div>
							<div>&#10064;</div>
							<Link to='/'>
								<div>&times;</div>
							</Link>
						</Squares>
					</TopBar>
					<ContentFooterWrap>
						<UtilPostWrap>
							<UtilWrap>
								<Search>
									<input type="text" placeholder='검색어를 입력하세요'/>
									<button>
										<div><GoSearch /></div>
									</button>
								</Search>
								<WritingButton>
									<Link to={`/writing?=boardId=${id}`}>
										<input type="button" value="글쓰기" />
									</Link>
								</WritingButton>
							</UtilWrap>
							<PostContainer>
								<Category>
									<div></div>
									<div>제목</div>
									<div>조회</div>
									<div>추천</div>
									<div>작성일</div>
								</Category>
								<ContentWrap>
									<PostWrap>
										{contents.map((el: PostPre, idx) => {
											return (<PostPreview key={idx} postData={el} />)
										})}
									</PostWrap>
								</ContentWrap>
								<PageNation
									curPage={page}
									totalPages={pages}
									pageChangeHandler={pageChangeHandler}
								/>
							</PostContainer>
						</UtilPostWrap>
						<Footer />
					</ContentFooterWrap>
				</PageContainer>
			</AppContainer>
		</>
	);
}
