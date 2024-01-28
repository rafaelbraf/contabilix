FROM openjdk:17 AS build
WORKDIR /app
COPY . /app/
RUN microdnf install findutils
RUN ./gradlew clean build -x test
FROM openjdk:17
WORKDIR /app
COPY --from=build /app/build/libs/contabilix-0.0.1-SNAPSHOT.jar contabilix-api.jar
ENV $(cat .env | grep -v ^# | xargs)
EXPOSE 8081
CMD ["java", "-jar", "contabilix-api.jar"]