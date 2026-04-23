package com.example.shopping.config;

import com.esotericsoftware.kryo.Kryo;
import com.esotericsoftware.kryo.io.Input;
import com.esotericsoftware.kryo.io.Output;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

public class KryoRedisSerializer<T> implements RedisSerializer<T> {

    private static final ThreadLocal<Kryo> KRYO_THREAD_LOCAL = ThreadLocal.withInitial(() -> {
        Kryo kryo = new Kryo();
        kryo.setRegistrationRequired(false);
        kryo.setReferences(true);
        return kryo;
    });

    @Override
    public byte[] serialize(T t) throws SerializationException {
        if (t == null) return new byte[0];
        try (Output output = new Output(4096, -1)) {
            KRYO_THREAD_LOCAL.get().writeClassAndObject(output, t);
            return output.toBytes();
        }
    }

    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        if (bytes == null || bytes.length == 0) return null;
        try (Input input = new Input(bytes)) {
            return (T) KRYO_THREAD_LOCAL.get().readClassAndObject(input);
        }
    }
}