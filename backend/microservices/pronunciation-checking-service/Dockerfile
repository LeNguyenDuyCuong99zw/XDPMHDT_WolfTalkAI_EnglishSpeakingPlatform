FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app

# Install native dependencies for Vosk
RUN apk add --no-cache libgomp

# Create models directory
RUN mkdir -p /app/models

COPY target/*.jar app.jar

EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"]
