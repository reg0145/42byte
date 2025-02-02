package com.blind.api.domain.comment.v1.service;

import com.blind.api.domain.comment.v1.dto.CommentMyDTO;
import com.blind.api.domain.comment.v1.dto.CommentResponseDTO;
import com.blind.api.domain.post.v2.domain.Post;
import com.blind.api.domain.comment.v1.domain.Comment;
import com.blind.api.domain.comment.v1.repository.CommentRepository;
import com.blind.api.domain.user.v2.domain.User;
import com.blind.api.global.exception.BusinessException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
public class CommentServiceImpl implements CommentService{
    private final CommentRepository commentRepository;

    @Override
    @Transactional
    public Page<Comment> findCommentByAuthorId(Long userId, Pageable pageable) {
        return commentRepository.findCommentByAuthorId(userId, pageable);
    }

    @Override
    @Transactional
    public void update(Comment comment, String content) {
        comment.setContent(content);
        commentRepository.saveAndFlush(comment);
        return comment;
    }

    @Override
    @Transactional
    public void delete(Comment comment) {
        comment.setIsDel(true);
        comment.setContent(null);
    }

    @Override
    @Transactional
    public void deleteCommentByPostId(Long postId) {
        commentRepository.deleteCommentByPostId(postId);
    }

    /* 댓글 저장 */
    @Override
    @Transactional
    public Comment save(Long boardId, Post post, User user, String content) {
        /* 게시글 작성자와 댓글 작성자 비교 */
        boolean isAuthor = post.getAuthorId().equals(user.getId()) ? true : false;

        Comment comment = Comment.builder()
                .boardId(boardId)
                .post(post)
                .authorId(user.getId())
                .content(content)
                .isAuthor(isAuthor)
                .build();
        return commentRepository.save(comment);
    }

    /*
     * 게시글의 모든 댓글 조회
     * */
    @Override
    @Transactional
    public List<Comment> findAllComment(Long boardId, Long postId) {
        List<Comment> commentList = commentRepository.findAllByBoardIdAndPostId(boardId, postId);
        return commentList;
    }

    @Override
    @Transactional
    public void updateLike(Long id, Long add) {
        commentRepository.updateLike(id, add);
    }

    @Override
    @Transactional
    public CommentResponseDTO findCommentByIdIn(Long userId, Pageable pageable) {
        Page<Comment> savePageable = findCommentByAuthorId(userId, pageable);
        CommentResponseDTO dtoList = new CommentResponseDTO();
        savePageable.stream().forEach( comment -> {
            dtoList.getContents().add(CommentMyDTO.from(comment));
        });
        dtoList.setPage(savePageable.getPageable().getPageNumber());
        dtoList.setPages(savePageable.getTotalPages());
        return dtoList;
    }

    @Override
    @Transactional
    public Comment findCommentById(Long id) {
        return commentRepository.findCommentById(id).orElseThrow(()-> new BusinessException("{comment.notfound}"));
    }

}
