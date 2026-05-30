package com.example.shopping.module.favorite.consumer;

import com.example.shopping.module.favorite.dto.FavoriteMsg;
import com.example.shopping.module.favorite.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class FavoriteConsumer {

    @Autowired
    private FavoriteService favoriteService;

    private static final String TOPIC = "topic_favorite_event";
    private static final String GROUP_ID = "favorite-consumer-group";

    /**
     * 批量消费收藏消息
     */
    @KafkaListener(topics = TOPIC, groupId = GROUP_ID, containerFactory = "batchListenerContainerFactory")
    public void listenBatch(List<FavoriteMsg> msgList,
                            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                            Acknowledgment ack) {
        try {
            // 批量处理
            favoriteService.handleFavoriteMsg(msgList);
        } finally {
            // 手动提交偏移量
            ack.acknowledge();
        }
    }


}