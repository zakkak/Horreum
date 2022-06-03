package io.hyperfoil.tools.horreum.entity.report;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.node.ArrayNode;

import io.hyperfoil.tools.horreum.entity.json.Test;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;

// Hyperfoil will sort runs that match the admittance filter (by default all)
// to categories and will create a table/chart for each unique value. This is similar to tags in regression series.
// Within each category it will calculate all combinations of values generated by series
// and labels and for each such 'cell' it will pick the last run within set time range.
@Entity
@Table(name = "tablereportconfig")
public class TableReportConfig extends PanacheEntityBase {
   @JsonProperty(required = true)
   @Id
   @GeneratedValue
   public Integer id;

   @NotNull
   public String title;

   // This column gets `null` when the test is deleted
   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "testid")
   public Test test;

   @Type(type = "io.hyperfoil.tools.horreum.entity.converter.JsonUserType")
   public ArrayNode filterLabels;
   public String filterFunction;

   @Type(type = "io.hyperfoil.tools.horreum.entity.converter.JsonUserType")
   public ArrayNode categoryLabels;
   public String categoryFunction;
   public String categoryFormatter;

   // this picks the column/series line
   @NotNull
   @Type(type = "io.hyperfoil.tools.horreum.entity.converter.JsonUserType")
   public ArrayNode seriesLabels;
   public String seriesFunction;
   public String seriesFormatter;

   // this determines the row/x axis
   @Type(type = "io.hyperfoil.tools.horreum.entity.converter.JsonUserType")
   public ArrayNode scaleLabels;
   public String scaleFunction;
   public String scaleFormatter;
   public String scaleDescription;

   @NotNull
   @OneToMany(mappedBy = "report", orphanRemoval = true, cascade = CascadeType.ALL)
   @OrderBy("order ASC")
   public List<ReportComponent> components;

   public void ensureLinked() {
      if (components != null) {
         for (ReportComponent c : components) {
            c.report = this;
         }
      }
   }
}
